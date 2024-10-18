import type { ReactNode } from 'react'
import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { FirebaseService } from '~/services/FirebaseService'
import type { User } from 'firebase/auth'
import useFirebase from '~/hooks/useFirebase'
import type { FirebaseOptions } from 'firebase/app'
import { getLocalStorageItem, setLocalStorageItem } from '~/utils/localStorage'
import HttpClientService from '~/services/HttpClientService'
import type { AxiosError } from 'axios'
import axios from 'axios'

// Define the type for the authentication context
interface AuthContextType {
    user: User | null
    register: (
        email: string,
        password: string,
        fullName: string,
        promotionSubscribe: string,
    ) => Promise<User>
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    isLoading: boolean
    isBusinessActivate: boolean
    jwtToken: string | null
    socialLogin: (channel: string) => Promise<void>
    checkEmailExist: (email: string) => Promise<void>
    fetchBusinessDetails: () => Promise<void>
}

// In-memory cache to store user data
let userCache: User | null = null

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider component
export const AuthProvider = ({
    children,
    firebaseConfig,
    strapiConfig: { baseUrl: strapiBaseUrl },
}: {
    children: ReactNode
    firebaseConfig: FirebaseOptions
    strapiConfig: { baseUrl: string }
}) => {
    const [user, setUser] = useState<User | null>(userCache)
    const [isLoading, setIsLoading] = useState(true)
    const [isBusinessActivate, setIsBusinessActivate] = useState<boolean>(false)
    const isFirebaseInitialized = useFirebase(firebaseConfig)
    const hasUserLoaded = useRef(false) // Ref to track user loading status
    const [jwtToken, setJwtToken] = useState<string | null>(null)
    const httpClientService = HttpClientService.initInstance(
        axios.create({
            baseURL: strapiBaseUrl,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        }),
    )

    // Function to fetch business details
    const fetchBusinessDetails = async () => {
        const currentUser = await FirebaseService.getCurrentUser()

        if (!currentUser) {
            throw new Error('No user to fetch business details')
        }

        try {
            const { uid: userRefId } = currentUser
            const response = await httpClientService.get<any>(
                `/api/business-details?filters[firebase_user_ref_id][$eq]=${userRefId}`,
            )
            const isActive = response.data && response.data.length > 0
            setIsBusinessActivate(isActive)
            setLocalStorageItem('isBusinessActivate', isActive)
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    // Load user from cache or localStorage
    useEffect(() => {
        const loadUser = async () => {
            if (!user && !userCache && !hasUserLoaded.current) {
                const storedUser = getLocalStorageItem('user') as User | null
                const storeJWTToken = getLocalStorageItem('strapi_jwt') as
                    | string
                    | null
                const storedBusinessActivate = getLocalStorageItem(
                    'isBusinessActivate',
                ) as boolean | null

                if (storedUser) {
                    userCache = storedUser // Set cache
                    setUser(storedUser) // Set state
                }
                if (storeJWTToken) {
                    setJwtToken(storeJWTToken)
                }

                // Set isBusinessActivate from localStorage if it exists
                if (storedBusinessActivate !== null) {
                    setIsBusinessActivate(storedBusinessActivate)
                }
                hasUserLoaded.current = true
            }

            if (isFirebaseInitialized && !userCache) {
                const auth = FirebaseService.getFirebaseAuth()
                if (auth) {
                    const unsubscribe = auth.onAuthStateChanged(
                        async (currentUser) => {
                            if (currentUser && currentUser !== userCache) {
                                userCache = currentUser
                                setUser(currentUser) // Update state
                                setLocalStorageItem('user', currentUser) // Sync with localStorage

                                // Fetch business details
                                await fetchBusinessDetails()
                            }
                            setIsLoading(false) // Auth check done
                        },
                    )
                    return () => unsubscribe()
                } else {
                    console.error('Firebase Auth is not initialized properly.')
                }
            }
            setIsLoading(false) // User state has been resolved
        }

        loadUser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isFirebaseInitialized])

    const register = async (
        email: string,
        password: string,
        fullName: string,
        promotionSubscibe: string,
    ) => {
        try {
            const userCredential: User = await httpClientService.post(
                '/api/auth/local/register',
                JSON.stringify({
                    email,
                    password,
                    fullName,
                    promotionSubscibe,
                }),
            )

            return userCredential
        } catch (error: any) {
            throw new Error(error.response.data.error.message)
        }
    }

    const socialLogin = async (channel: string) => {
        let userCredential: any

        if (channel !== 'facebook' && channel !== 'google') {
            throw new Error('Invalid social login channel')
        }

        try {
            switch (channel) {
                case 'google':
                    userCredential = await FirebaseService.loginWithGoogle()
                    break
                case 'facebook':
                    userCredential = await FirebaseService.loginWithFacebook()
                    break
                default:
                    break
            }

            const currentUser = await FirebaseService.getCurrentUser()
            const firebaseToken = await currentUser?.getIdToken()
            const { accessToken } = userCredential

            if (firebaseToken) {
                userCredential = await httpClientService.post(
                    '/api/users-permissions/auth/verify',
                    {
                        accessToken,
                        firebaseToken,
                        channel,
                    },
                )
            }

            if (userCredential && currentUser !== userCache) {
                userCache = currentUser
                setUser(currentUser) // Set user in state
                setLocalStorageItem('user', currentUser) // Store in localStorage

                // Use Strapi JWT token for future API calls
                if (userCredential?.jwt) {
                    setLocalStorageItem('strapi_jwt', userCredential.jwt)
                }

                // Fetch business details
                await fetchBusinessDetails()
            }
        } catch (error: any) {
            throw new Error(error.response.data.error.message)
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const userCredential = await httpClientService.post<any>(
                '/api/auth/local',
                JSON.stringify({ identifier: email, password }),
            )

            await FirebaseService.signIn(email, password)

            if (userCredential !== userCache) {
                userCache = userCredential
                setUser(userCredential) // Set user in state
                setLocalStorageItem('user', userCredential) // Store in localStorage

                // Use Strapi JWT token for future API calls
                if (userCredential?.jwt) {
                    setLocalStorageItem('strapi_jwt', userCredential.jwt)
                }

                // Fetch business details
                await fetchBusinessDetails()
            }
        } catch (error: any) {
            throw new Error(error.response.data.error.message)
        }
    }

    const logout = async () => {
        try {
            await FirebaseService.signOut()
            if (userCache) {
                userCache = null
                setUser(null) // Clear user in state
                setLocalStorageItem('user', null) // Clear localStorage
                setIsBusinessActivate(false)
                setLocalStorageItem('isBusinessActivate', false)
                setJwtToken(null)
                setLocalStorageItem('strapi_jwt', null)
            }
        } catch (error: any) {
            throw new Error(error.response.data.error.message)
        }
    }

    const checkEmailExist = async (email: string) => {
        try {
            await httpClientService.get<any>(
                `/api/users-permissions/auth/checkUserExistByEmail?email=${email}`,
            )
        } catch (error) {
            switch ((error as AxiosError).response?.status) {
                case 404:
                case 403:
                    throw new Error(
                        ((error as AxiosError).response?.data as any)?.error
                            ?.message ?? 'This email is not registered',
                    )
                default:
                    throw new Error(
                        'An error occurred while checking the email',
                    )
            }
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                register,
                login,
                logout,
                isLoading,
                isBusinessActivate,
                jwtToken,
                socialLogin,
                checkEmailExist,
                fetchBusinessDetails,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

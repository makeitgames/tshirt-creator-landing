import type { ReactNode } from 'react'
import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { FirebaseService } from '~/services/FirebaseService'
import type { User } from 'firebase/auth'
import useFirebase from '~/hooks/useFirebase'
import type { FirebaseOptions } from 'firebase/app'
import { getLocalStorageItem, setLocalStorageItem } from '~/utils/localStorage'
import HttpClientService from '~/services/HttpClientService'

// Define the type for the authentication context
interface AuthContextType {
    user: User | null
    register: (
        email: string,
        password: string,
        fullName: string,
        promotionSubscribe: string,
    ) => Promise<void>
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    isLoading: boolean
    isBusinessActivate: boolean
    jwtToken: string | null
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
    const strapiHttpClientService = new HttpClientService()

    // Function to fetch business details
    const fetchBusinessDetails = async (userRefId: string) => {
        try {
            const response = await strapiHttpClientService.get<any>(
                `${strapiBaseUrl}/api/business-details?filters[firebase_user_ref_id][$eq]=${userRefId}`,
            )
            return response.data
        } catch (error) {
            console.error('Error fetching business details', error)
            return null
        }
    }

    // Load user from cache or localStorage
    useEffect(() => {
        console.log(strapiBaseUrl)
        const loadUser = async () => {
            if (!user && !userCache && !hasUserLoaded.current) {
                const storedUser = getLocalStorageItem('user') as User | null
                const storeJWTToken = getLocalStorageItem('strapi_jwt') as
                    | string
                    | null
                if (storedUser) {
                    userCache = storedUser // Set cache
                    setUser(storedUser) // Set state
                }
                if (storeJWTToken) {
                    setJwtToken(storeJWTToken)
                }
                hasUserLoaded.current = true
            }

            if (isFirebaseInitialized && !userCache) {
                console.log('try to catch user')
                const auth = FirebaseService.getFirebaseAuth()
                if (auth) {
                    const unsubscribe = auth.onAuthStateChanged(
                        async (currentUser) => {
                            if (currentUser && currentUser !== userCache) {
                                userCache = currentUser
                                setUser(currentUser) // Update state
                                setLocalStorageItem('user', currentUser) // Sync with localStorage

                                // Fetch business details
                                const businessDetails =
                                    await fetchBusinessDetails(currentUser.uid)
                                const isActive =
                                    businessDetails &&
                                    businessDetails.length > 0
                                setIsBusinessActivate(isActive)
                                setLocalStorageItem(
                                    'isBusinessActivate',
                                    isActive,
                                )
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
            const userCredential = await strapiHttpClientService.post<any>(
                `${strapiBaseUrl}/api/auth/local/register`,
                JSON.stringify({
                    email,
                    password,
                    fullName,
                    promotionSubscibe,
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )

            return userCredential
        } catch (error: any) {
            console.error('Login failed', error.message)
            throw new Error(error.message)
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const userCredential = await strapiHttpClientService.post<any>(
                `${strapiBaseUrl}/api/auth/local`,
                JSON.stringify({ identifier: email, password }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
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
                const businessDetails = await fetchBusinessDetails(
                    userCredential?.userRefId ?? '',
                )
                const isActive = businessDetails && businessDetails.length > 0
                setIsBusinessActivate(isActive)
                setLocalStorageItem('isBusinessActivate', isActive)
            }
        } catch (error: any) {
            console.error('Login failed', error.message)
            throw new Error(error.message)
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
        } catch (error) {
            console.error('Logout failed', (error as Error).message)
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

import type { ReactNode } from 'react'
import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { FirebaseService } from '~/services/FirebaseService'
import type { User } from 'firebase/auth'
import useFirebase from '~/hooks/useFirebase'
import type { FirebaseOptions } from 'firebase/app'
import { getLocalStorageItem, setLocalStorageItem } from '~/utils/localStorage'

// Define the type for the authentication context
interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    isLoading: boolean
}

// In-memory cache to store user data
let userCache: User | null = null

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider component
export const AuthProvider = ({
    children,
    firebaseConfig,
}: {
    children: ReactNode
    firebaseConfig: FirebaseOptions
}) => {
    const [user, setUser] = useState<User | null>(userCache)
    const [isLoading, setIsLoading] = useState(true)
    const isFirebaseInitialized = useFirebase(firebaseConfig)
    const hasUserLoaded = useRef(false) // Ref to track user loading status

    // Load user from cache or localStorage
    useEffect(() => {
        const loadUser = async () => {
            if (!user && !userCache && !hasUserLoaded.current) {
                const storedUser = getLocalStorageItem('user') as User | null
                if (storedUser) {
                    userCache = storedUser // Set cache
                    setUser(storedUser) // Set state
                }
                hasUserLoaded.current = true
            }

            if (isFirebaseInitialized && !userCache) {
                const auth = FirebaseService.getFirebaseAuth()
                if (auth) {
                    const unsubscribe = auth.onAuthStateChanged(
                        (currentUser) => {
                            if (currentUser && currentUser !== userCache) {
                                userCache = currentUser
                                setUser(currentUser) // Update state
                                setLocalStorageItem('user', currentUser) // Sync with localStorage
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
    }, [user, isFirebaseInitialized])

    const login = async (email: string, password: string) => {
        try {
            const userCredential = await FirebaseService.signIn(email, password)
            if (userCredential.user !== userCache) {
                userCache = userCredential.user
                setUser(userCredential.user) // Set user in state
                setLocalStorageItem('user', userCredential.user) // Store in localStorage
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
            }
        } catch (error) {
            console.error('Logout failed', (error as Error).message)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isLoading,
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

import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import { initializeApp } from 'firebase/app'
import type { Analytics } from 'firebase/analytics'
import { getAnalytics } from 'firebase/analytics'
import type { Auth, User, UserCredential } from 'firebase/auth'
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
    sendPasswordResetEmail,
    FacebookAuthProvider,
    signInWithPopup,
} from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc,
    query,
    where,
    getCountFromServer,
    getDocs,
} from 'firebase/firestore'

export class FirebaseService {
    private static firebaseApp: FirebaseApp | null = null
    private static firebaseAuth: Auth | null = null
    private static firestore: Firestore | null = null
    private static firebaseAnalytics: Analytics | null = null

    // Initialize Firebase with provided configuration
    public static async initialize(config: FirebaseOptions): Promise<void> {
        this.firebaseApp = initializeApp(config)
        this.firebaseAuth = getAuth(this.firebaseApp)
        this.firestore = getFirestore(this.firebaseApp)

        if (typeof window !== 'undefined') {
            this.firebaseAnalytics = getAnalytics(this.firebaseApp)
        }
    }

    // Ensure Firebase services are initialized before using them
    public static ensureInitialized(): void {
        if (!this.firebaseAuth || !this.firestore) {
            throw new Error(
                'Firebase is not initialized. Call FirebaseService.initialize() first.',
            )
        }
    }

    // Get Firebase App instance
    public static getFirebaseApp(): FirebaseApp | null {
        return this.firebaseApp
    }

    // Get Firebase Analytics instance
    public static getFirebaseAnalytics(): Analytics | null {
        return this.firebaseAnalytics
    }

    // Get Firebase Auth instance
    public static getFirebaseAuth(): Auth | null {
        return this.firebaseAuth
    }

    // Firestore Methods
    public static async addDocument(
        collectionName: string,
        data: any,
    ): Promise<string> {
        this.ensureInitialized()
        try {
            const docRef = await addDoc(
                collection(this.firestore!, collectionName),
                data,
            )
            return docRef.id
        } catch (error) {
            throw new Error(
                'Error adding document to Firestore: ' +
                    (error as Error).message,
            )
        }
    }

    public static async setDocument(
        collectionName: string,
        docId: string,
        data: any,
    ): Promise<void> {
        this.ensureInitialized()
        try {
            await setDoc(doc(this.firestore!, collectionName, docId), data)
        } catch (error) {
            throw new Error(
                'Error setting document in Firestore: ' +
                    (error as Error).message,
            )
        }
    }

    public static async countDocuments(
        collectionName: string,
        whereClause: { [key: string]: string },
    ): Promise<number> {
        this.ensureInitialized()
        try {
            const countSnapshot = await getCountFromServer(
                query(
                    collection(this.firestore!, collectionName),
                    ...Object.keys(whereClause).map((key) =>
                        where(key, '==', whereClause[key]),
                    ),
                ),
            )
            return countSnapshot.data().count
        } catch (error) {
            throw new Error(
                'Error fetching documents from Firestore: ' +
                    (error as Error).message,
            )
        }
    }

    public static async getDocuments(
        collectionName: string,
        whereClause: { [key: string]: string } = {},
    ): Promise<any[]> {
        this.ensureInitialized()
        try {
            const querySnapshot = await getDocs(
                query(
                    collection(this.firestore!, collectionName),
                    ...Object.keys(whereClause).map((key) =>
                        where(key, '==', whereClause[key]),
                    ),
                ),
            )

            // Map through the documents to return data with the id included
            return querySnapshot.docs.map((doc) => ({
                ...doc.data(), // Spread the existing document data
                id: doc.id, // Add the document ID
            }))
        } catch (error) {
            throw new Error(
                'Error fetching documents from Firestore: ' +
                    (error as Error).message,
            )
        }
    }

    public static async getDocumentById(
        collectionName: string,
        docId: string,
    ): Promise<any> {
        this.ensureInitialized()
        try {
            const docSnap = await getDoc(
                doc(this.firestore!, collectionName, docId),
            )
            if (docSnap.exists()) {
                return docSnap.data()
            } else {
                throw new Error('No document found.')
            }
        } catch (error) {
            throw new Error(
                'Error fetching document from Firestore: ' +
                    (error as Error).message,
            )
        }
    }

    // User Signup with email and password
    public static async signup(
        email: string,
        password: string,
    ): Promise<UserCredential> {
        this.ensureInitialized()
        try {
            return await createUserWithEmailAndPassword(
                this.firebaseAuth!,
                email,
                password,
            )
        } catch (error: any) {
            throw new Error(this.mapFirebaseAuthError(error.code))
        }
    }

    // User Sign-In with email and password
    public static async signIn(
        email: string,
        password: string,
    ): Promise<UserCredential> {
        this.ensureInitialized()
        try {
            const user = await signInWithEmailAndPassword(
                this.firebaseAuth!,
                email,
                password,
            )
            return user
        } catch (error: any) {
            throw new Error(this.mapFirebaseAuthError(error.code))
        }
    }

    // Sign out the current user
    public static async signOut(): Promise<void> {
        this.ensureInitialized()
        try {
            await this.firebaseAuth!.signOut()
        } catch (error) {
            throw new Error('Error signing out.')
        }
    }

    // Get current user
    public static async getCurrentUser(): Promise<User | null> {
        this.ensureInitialized()
        return this.firebaseAuth!.currentUser
    }

    // Check if the user is authenticated
    public static async isAuthenticated(): Promise<boolean> {
        this.ensureInitialized()
        return !!this.firebaseAuth!.currentUser
    }

    // Send a verification email to the current user
    public static async sendVerificationEmail(): Promise<void> {
        this.ensureInitialized()
        try {
            if (this.firebaseAuth!.currentUser) {
                await sendEmailVerification(this.firebaseAuth!.currentUser)
            } else {
                throw new Error('No user is currently signed in.')
            }
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    public static async sendPasswordRecoveryEmail(
        email: string,
    ): Promise<void> {
        this.ensureInitialized()
        try {
            await sendPasswordResetEmail(this.firebaseAuth!, email)
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    // Update current user's profile information
    public static async updateUserProfile({
        displayName = '',
        photoURL = '',
    }: {
        displayName?: string
        photoURL?: string
    }): Promise<void> {
        this.ensureInitialized()
        try {
            if (this.firebaseAuth!.currentUser) {
                await updateProfile(this.firebaseAuth!.currentUser, {
                    displayName,
                    photoURL,
                })
            } else {
                throw new Error('No user is currently signed in.')
            }
        } catch (error) {
            throw new Error('Error updating profile.')
        }
    }

    // Map Firebase Auth errors to custom messages
    public static mapFirebaseAuthError(errorCode: string): string {
        switch (errorCode) {
            case 'auth/invalid-credential':
                return 'The email address or password is incorrect. Please check again.'
            case 'auth/email-already-in-use':
                return 'The email address is already in use by another account.'
            case 'auth/weak-password':
                return 'The password is too weak.'
            case 'auth/user-not-found':
                return 'No account found with this email.'
            case 'auth/wrong-password':
                return 'Incorrect password.'
            default:
                return 'An unknown error occurred. Please try again.'
        }
    }

    // Get Firebase configuration from environment variables
    public static getFirebaseConfig(): FirebaseOptions {
        if (
            !process.env.PUBLIC_FIREBASE_API_KEY ||
            !process.env.PUBLIC_FIREBASE_AUTH_DOMAIN ||
            !process.env.PUBLIC_FIREBASE_PROJECT_ID ||
            !process.env.PUBLIC_FIREBASE_STORAGE_BUCKET ||
            !process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
            !process.env.PUBLIC_FIREBASE_APP_ID
        ) {
            throw new Error(
                'Firebase configuration is missing. Check your .env file.',
            )
        }

        return {
            apiKey: process.env.PUBLIC_FIREBASE_API_KEY!,
            authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN!,
            projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID!,
            storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET!,
            messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
            appId: process.env.PUBLIC_FIREBASE_APP_ID!,
            measurementId: process.env.PUBLIC_FIREBASE_MEASUREMENT_ID!,
        }
    }

    public static async loginWithFacebook(): Promise<any> {
        this.ensureInitialized()
        const provider = new FacebookAuthProvider()
        try {
            const result = await signInWithPopup(this.firebaseAuth!, provider)
            // Facebook Access Token
            const credential = FacebookAuthProvider.credentialFromResult(result)
            const accessToken = credential?.accessToken

            if (result.user) {
                const { photoURL, displayName } = result.user
                // Use the access token to get additional user info like the avatar
                if (accessToken) {
                    // Fetch user profile image from Facebook Graph API
                    const response = await fetch(
                        `https://graph.facebook.com/me?fields=picture.type(large)&access_token=${accessToken}`,
                    )
                    const data = await response.json()
                    const { providerData } = result.user

                    if (providerData.length) {
                        const facebookUserInfo = {
                            ...providerData[0],
                            avatarUrl: data.picture?.data?.url,
                        }

                        const { avatarUrl, displayName: facebookDisplayName } =
                            facebookUserInfo
                        if (
                            (avatarUrl && avatarUrl !== photoURL) ||
                            facebookDisplayName !== displayName
                        ) {
                            await this.updateUserProfile({
                                photoURL: avatarUrl,
                                displayName:
                                    facebookDisplayName ??
                                    `user-${Math.floor(Math.random() * 1e14)
                                        .toString()
                                        .padStart(14, '0')}`,
                            })
                        }
                    }
                }
            }

            return { ...result.user, accessToken }
        } catch (error) {
            throw new Error(
                'Error logging in with Facebook: ' + (error as Error).message,
            )
        }
    }
}

type UserInfo = {
    auth_provider?: string
    blocked?: boolean
    channel?: string
    confirmationToken?: string | null
    confirmed?: boolean
    createdAt?: string
    display_name?: string
    documentId?: string
    email?: string
    firebaseToken?: string
    firebase_user_ref_id?: string
    id?: number
    jwt?: string
    locale?: string | null
    password?: string | null
    promotion_subscribe?: boolean
    provider?: string
    publishedAt?: string
    resetPasswordToken?: string | null
    role?: string | null
    updatedAt?: string
    username?: string
}

export type { UserInfo }

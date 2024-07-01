export type SignInCredential = {
    phone: string
    password: string
}

export type SignInResponse = {
    // token: string
    // user: {
    //     userName: string
    //     authority: string[]
    //     avatar: string
    //     email: string
    // }
    tokens: {
        access: {
            token: string,
            expires: string
        },
        refresh: {
            token: string,
            expires: string
        }
    },
    user: {
        name: string,
        phone: string,
        email: string,
        isVerified: boolean,
        role: string,
        createdAt: string,
        updatedAt: string,
        id: string
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    name: string
    email: string
    password: string
    phone: string | undefined
    fcmToken?: string | undefined
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

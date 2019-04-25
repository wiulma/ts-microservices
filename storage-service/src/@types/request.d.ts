declare type HelloUser = {
    name: string;
}

declare type UserRequestAuth = {
    username: string;
    password: string;
}

declare type RegisterRequest = {
    profile: UserModel;
    auth: UserRequestAuth
}

declare type UpdateAuthRequest = {
    password: string;
    role?: string
}

declare type ResetAuthRequest = {
    username?: string;
    email?: string;
}
declare type SayHelloResponse = {
    reply: string;
}

declare type UserResponse = {
    id: number;
    name: string;
    surname: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

declare type UserDetailResponse = UserResponse & { gender: string}

declare type CredentialResponse = {
    token: string;
}

declare type ResetAuthResponse = {
    username: string;
    password: string;
}
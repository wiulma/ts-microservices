declare type HelloModel = {
    name: string;
    msg: string;
}

declare interface UserModel {
    id: number;
    name: string;
    surname: string;
    gender: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}


declare interface CredentialModel {
    idUser: number;
    username: string;
    password: string;
    role: string;
    token?: string;
}
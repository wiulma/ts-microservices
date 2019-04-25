
import * as bcrypt from "bcryptjs";
import { IsNotEmpty, Length } from "class-validator";
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    Unique
} from "typeorm";

import { Roles } from "../enums/Roles";
import { User } from "./User";

@Entity("credentials")
@Unique(["username"])
export class Credential implements CredentialModel {

    public static hashPassword(pwd: string) {
        return bcrypt.hashSync(pwd, 8);
    }

    @PrimaryColumn()
    public idUser: number;

    @Column()
    @Length(4, 20)
    public username: string;

    @Column()
    @Length(4, 100)
    public password: string;

    @Column()
    @IsNotEmpty()
    public role: string;

    @Column({ nullable: true })
    public token: string;

    @OneToOne((type) => User)
    @JoinColumn({name: "idUser"})
    public user: User;

    constructor(auth?: CredentialModel) {
        if (auth) {
            this.idUser = auth.idUser;
            this.username = auth.username;
            this.password = auth.password;
            this.password = Credential.hashPassword(this.password);
            this.role = auth.role;
        }
    }

    public checkPassword(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}

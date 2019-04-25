
import { IsEmail, IsNotEmpty } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn
} from "typeorm";

@Entity("users")
@Unique(["id"])
export class User implements UserModel {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @IsNotEmpty()
    public name: string;

    @Column()
    @IsNotEmpty()
    public surname: string;

    @Column({ nullable: true })
    public male: string;

    @Column()
    @IsEmail()
    public email: string;

    @Column()
    @CreateDateColumn({ type: "timestamp" })
    public createdAt: Date;

    @Column()
    @UpdateDateColumn({ type: "timestamp" })
    public updatedAt: Date;

    constructor(user?: UserModel) {
        if (user) {
            this.email = user.email;
            this.male = user.male;
            this.name = user.name;
            this.surname = user.surname;
        }
    }

}

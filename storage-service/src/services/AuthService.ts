import * as jwt from "jsonwebtoken";
import { InternalServerError, UnauthorizedError } from "routing-controllers";
import { Container } from "typedi";
import { getManager, getRepository, Repository } from "typeorm";
import { AppError, CustomErrors } from "../context/components/AppErrors";
import { Configuration } from "../context/components/Configuration";
import { Credential } from "../entities/Credentials";
import { User } from "../entities/User";
import { Roles } from "../enums/Roles";

export const AuthService = {

    /**
     * @method login
     * @description do login user
     * @param user request user
     * @return authenticated user
     */
    async login(reqUser: UserRequestAuth): Promise<CredentialModel> {
        // Check if username and password are set

        const { username, password } = reqUser;
        if (!(username && password)) {
            throw new UnauthorizedError(CustomErrors.InvalidCredentials);
        }

        // Get user from database
        const credentialsRepository: Repository<Credential>  = getRepository(Credential);
        let credentials: Credential;
        try {
            credentials = await credentialsRepository.findOneOrFail({ where: { username } });
        } catch (error) {
            throw new UnauthorizedError(CustomErrors.InvalidCredentials);
        }

        // Check if encrypted password match
        if (!credentials.checkPassword(password)) {
            throw new UnauthorizedError(CustomErrors.InvalidCredentials);
        }

        // Sing JWT, valid for 1 hour
        credentials.token = this.generatePayload(credentials.idUser.toString());

        try {
            const result: Credential = await credentialsRepository.save(credentials);

            // Send the jwt in the response
            return result;
        } catch (err) {
            throw new InternalServerError(CustomErrors.InvalidCredentials);
        }

    },

    generatePayload(id: string): string {
        const payload = {
            exp: ((new Date().getTime()) + (60 * 60)),
            iss: "samplestorage",
            sub: id
        };
        const config = Container.get<Configuration>(Configuration);
        return jwt.sign(payload, config.get<string>("secretKey"));
    },

    async logout(user: UserModel): Promise<CredentialModel> {
        try {
            const credentialRepo: Repository<Credential> = getRepository(Credential);
            const userAuth: CredentialModel = await credentialRepo.findOne(user.id);
            userAuth.token = undefined;
            return await credentialRepo.save(userAuth);
        } catch (exc) {
            throw new AppError(exc.message, exc.details);
        }

    },

    async auth(token: string, id: number): Promise<UserModel> {
        if (!id) { throw new AppError(CustomErrors.InvalidParameters); }
        try {
            const user =  getRepository(User).findOne(id);

            const userAuth: CredentialModel = await getRepository(Credential).findOne(id);
            return (userAuth.token === token) ? user : undefined;

        } catch (exc) {
            throw new AppError(exc.message, exc.details);
        }

    },

    async register(registerData: RegisterRequest): Promise<RegisterData> {

        try {
            const {profile, auth} = registerData;
            const userRepo: Repository<User> = getRepository(User);
            const credentialRepo: Repository<Credential> = getRepository(Credential);

            const checkEmail: User =  await userRepo.findOne({email: profile.email});
            if (checkEmail) { throw new AppError(CustomErrors.ConflictError, "duplicated.email"); }

            const checkUsername: Credential = await credentialRepo.findOne({username: auth.username});
            if (checkUsername) { throw new AppError(CustomErrors.ConflictError, "duplicated.username"); }

            return await getManager().transaction(async (tem) => {

                const user: User = new User(profile);
                await tem.save(user);

                const credential: Credential = new Credential({idUser: user.id, role: Roles.User, ...auth});
                await tem.save(credential);

                return {
                    profile: user,
                    auth: {
                        username: credential.username,
                        role: credential.role
                    }
                };

            });

        } catch (exc) {
            throw new AppError(exc.message, exc.details);
        }
    },

    async updateAuth(id: number, auth: UpdateAuthRequest): Promise<CredentialModel>  {
        if (!id) { throw new AppError(CustomErrors.InvalidParameters); }
        const credentialRepo: Repository<Credential> = getRepository(Credential);
        const authUser: Credential = await credentialRepo.findOneOrFail(id);
        authUser.token = undefined;
        credentialRepo.merge(authUser, auth,
            {
                password: (auth.password ? Credential.hashPassword(auth.password) : authUser.password)
            }
        );
        return credentialRepo.save(authUser);
    },

    async resetAuth(auth: ResetAuthRequest): Promise<ResetAuthResponse>  {
        if (!auth.email && ! auth.username) {
            throw new AppError(CustomErrors.MissingParameters);
        }
        let credentials;
        const credentialRepo: Repository<Credential> = getRepository(Credential);
        if (auth.email) {
            const user = await getRepository(User).findOneOrFail({email: auth.email});
            credentials = await credentialRepo.findOneOrFail({idUser: user.id});

        } else if (auth.username) {
            credentials = await credentialRepo.findOneOrFail({username: auth.username});
        }
        if (!credentials) { throw new AppError(CustomErrors.InvalidParameters); }
        const tempPwd = this.generateTemporaryPwd();
        credentials.password =  Credential.hashPassword(tempPwd);
        const result = await credentialRepo.save(credentials);
        return {
            username: result.username,
            password: tempPwd
        };

    },

    generateTemporaryPwd(): string {
        // tslint:disable-next-line:no-bitwise
        return [...Array(30)].map((_) => (Math.random() * 36 | 0).toString(36)).join("");
    }

};

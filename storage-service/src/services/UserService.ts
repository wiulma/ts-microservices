import { getRepository, Repository } from "typeorm";
import { AppError, CustomErrors } from "../context/components/AppErrors";
import { User } from "../entities/User";

export const UserService = {

    /**
     * @method getAll
     * @description get all users
     * @return users list
     */
    async getAll(): Promise<UserModel[]> {
        /*

        */
        const users: User[] = await getRepository(User).find(
            {
                order: {

                    surname: "ASC",
                    name: "ASC"
                }
            }
        );
        return users;
    },

    /**
     * @method getById
     * @description get user by its id
     * @param id user id
     * @return user
     */
    getById(id: number): Promise<UserModel> {
        if (!id) { throw new AppError(CustomErrors.InvalidParameters); }
        return getRepository(User).findOne(id);
    },

    /**
     * @method save
     * @description save users
     * @param user
     * @return saved user
     */
    save(user: UserModel): Promise<UserModel> {
        const userRepo: Repository<UserModel> = getRepository(User);
        const userEntity: UserModel = userRepo.create(user);
        return userRepo.save(userEntity);
    },

    /**
     * @method update
     * @description get all users
     * @param id user id
     * @param user
     * @return saved user
     */
    async update(id: number, user: UserModel): Promise<UserModel> {
        if (!id) { throw new AppError(CustomErrors.InvalidParameters); }
        const userRepo: Repository<UserModel>  = getRepository(User);
        const userEntity: UserModel = await userRepo.findOne(id);
        userRepo.merge(userEntity, user);
        return userRepo.save(userEntity);
    },

    /**
     * @method delete
     * @description delete user by ts id
     * @param id user id
     * @return deleted user
     */
    async delete(id: number): Promise<UserModel> {
        if (!id) { throw new AppError(CustomErrors.InvalidParameters); }
        const userRepo: Repository<UserModel>  = getRepository(User);
        const userEntity: UserModel = await userRepo.findOne(id);
        userRepo.remove(userEntity);
        return userEntity;
    }

};

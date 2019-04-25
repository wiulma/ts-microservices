/**
 * @class UsersResponseMapper
 * @name UsersResponseMapper
 * @description Response mapper for say Users API
 */

export const UsersResponseMapper  = {

    /**
     * @method mapUsers
     * @description Map Users response
     * @param {UserModel} user
     * @return {UserResponse} response
     */
    mapUser: (model: UserModel): UserResponse => {
        const {id, name, surname, email, createdAt, updatedAt} = model;
        return {id, name, surname, email, createdAt: createdAt.toString(), updatedAt: updatedAt.toString()};
    },

    /**
     * @method mapUserDetail
     * @description Map say Users response
     * @param {UserModel} user
     * @return {UserModel} response
     */
    mapUserDetail: (model: UserModel): UserDetailResponse => {
        const {createdAt, updatedAt, ...fields} = model;
        return {...fields, createdAt: createdAt.toString(), updatedAt: updatedAt.toString()};
    }

};

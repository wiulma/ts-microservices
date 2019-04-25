import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { Service } from "typedi";
import { Logger } from "../context/components/Logger";
import { UsersResponseMapper } from "../mapper/UsersResponseMapper";
import { UserService } from "../services/UserService";
/**
 * Users Controller
 * @class UsersController
 */
@Service()
@JsonController("/users")
export class UsersController {

    constructor(private logger: Logger) { }

    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Get users list
     *     description: Get users list
     *     tags:
     *       - Users
     *     produces:
     *       - application/json
     *     security:
     *       - BearerToken: []
     *     responses:
     *       200:
     *         $ref: '../spec/responses/users.yml#/UsersListSuccessResponse'
     */

    /**
     * @method getListUsers
     * @description Get List Users
     * @api {get} /users
     * @return users list
     */
    @Get()
    @Authorized()
    public async getListUsers(): Promise<UserResponse[]> {
        const results: UserModel[] = await UserService.getAll();
        return results.map(UsersResponseMapper.mapUser);
    }

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Get user detail
     *     description: Get user detail
     *     tags:
     *       - Users
     *     produces:
     *       - application/json
     *     parameters:
     *       - $ref: '../spec/parameters/users.yml#/userId'
     *     security:
     *       - BearerToken: []
     *     responses:
     *       200:
     *         $ref: '../spec/responses/users.yml#/UserDetailSuccessResponse'
     */

    /**
     * @method getUser
     * @description Get User detail
     * @api {get} /users/{id}
     * @param id user id
     * @return users list
     */
    @Get("/:id")
    @Authorized()
    public async getUser(@Param("id") id: number): Promise<UserDetailResponse> {
        return UsersResponseMapper.mapUserDetail(await UserService.getById(id));
    }

    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Save new user
     *     description: save new user
     *     tags:
     *       - Users
     *     produces:
     *       - application/json
     *     parameters:
     *       - $ref: '../spec/parameters/users.yml#/userDetail'
     *     security:
     *       - BearerToken: []
     *     responses:
     *       200:
     *         $ref: '../spec/responses/users.yml#/UserDetailSuccessResponse'
     */

    /**
     * @method save
     * @description Save new user
     * @api {post} /users
     * @param user user data
     * @return saved user
     */
    @Post()
    @Authorized()
    public async save(@Body() user: UserModel): Promise<UserDetailResponse> {
        return UsersResponseMapper.mapUserDetail(await UserService.save(user));
    }

    /**
     * @swagger
     * /users/{id}:
     *   put:
     *     summary: Save new user
     *     description: new user
     *     tags:
     *       - Users
     *     produces:
     *       - application/json
     *     parameters:
     *       - $ref: '../spec/parameters/users.yml#/userId'
     *       - $ref: '../spec/parameters/users.yml#/userDetail'
     *     security:
     *       - BearerToken: []
     *     responses:
     *       200:
     *         $ref: '../spec/responses/users.yml#/UserDetailSuccessResponse'
     */

    /**
     * @method update
     * @description Save new user
     * @api {put} /users/{id}
     * @param id user id
     * @param user user data
     * @return saved user
     */
    @Put("/:id")
    @Authorized()
    public async update(@Param("id") id: number, @Body() user: UserModel): Promise<UserDetailResponse> {
        return UsersResponseMapper.mapUserDetail(await UserService.update(id, user));
    }

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Delete user data (gdpr)
     *     description: Delete user data (gdpr)
     *     tags:
     *       - Users
     *     produces:
     *       - application/json
     *     parameters:
     *       - $ref: '../spec/parameters/users.yml#/userId'
     *     security:
     *       - BearerToken: []
     *     responses:
     *       200:
     *         $ref: '../spec/responses/users.yml#/DeleteUserSuccessResponse'
     */

    /**
     * @method delete
     * @description Delte user by its id
     * @api {delete} users/{id}
     * @param id user id
     * @return deleted user
     */
    @Delete("/:id")
    @Authorized()
    public async delete(@Param("id") id: number): Promise<UserResponse> {
        return UsersResponseMapper.mapUser(await UserService.delete(id));
    }

}

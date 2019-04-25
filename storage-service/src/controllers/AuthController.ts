import { Request } from "express";
import { Authorized, Body, JsonController, Param, Post, Put, Req } from "routing-controllers";
import { Service } from "typedi";
import { Logger } from "../context/components/Logger";
import { AuthService } from "../services/AuthService";
/**
 * Auth Controller
 * @class AuthController
 */
@Service()
@JsonController()
export class AuthController {

    constructor(private logger: Logger) { }

    /**
     * @swagger
     * /login:
     *   post:
     *     summary: Login user api
     *     description: Login user api
     *     tags:
     *       - Auth
     *     produces:
     *       - application/json
     *     parameters:
     *       - $ref: '../spec/parameters/auth.yml#/userLogin'
     *     responses:
     *       200:
     *         $ref: '../spec/responses/auth.yml#/LoginSuccessResponse'
     */

    /**
     * @method doLogin
     * @description Login API
     * @api {post} /login/ Request login
     * @return logged user or error
     */
    @Post("/login")
    public async doLogin(@Body() reqUser: UserRequestAuth): Promise<CredentialResponse> {
        const user: CredentialModel = await AuthService.login(reqUser);
        this.logger.debug(`User ${user.username} logged in`);
        return { token: user.token };
    }

    /**
     * @swagger
     * /logout:
     *   get:
     *     summary: Logout user api
     *     description: Logout user api
     *     tags:
     *       - Auth
     *     produces:
     *       - application/json
     *     security:
     *       - BearerToken: []
     *     responses:
     *       204:
     *         $ref: '../spec/common/responses.yml#/EmptySuccessResponse'
     */

    /**
     * @method doLogout
     * @description Logout API
     * @api {post} /logout/ Request logout
     * @return undefined
     */
    @Post("/logout")
    @Authorized()
    public async doLogout(@Req() request: Request): Promise<void> {
        AuthService.logout(request.user);
        return null;
    }

    /**
     * @swagger
     * /register:
     *   post:
     *     summary: Register user api
     *     description: Register user api
     *     tags:
     *       - Auth
     *     produces:
     *       - application/json
     *     security:
     *       - BearerToken: []
     *     responses:
     *       204:
     *         $ref: '../spec/common/responses.yml#/EmptySuccessResponse'
     *       409:
     *         $ref: '../spec/common/responses.yml#/ConflictErrorResponse'
     */

    /**
     * @method register
     * @description Register API
     * @api {post} /register/ Registered user profile
     * @return undefined
     */
    @Post("/register")
    public async register(@Body() registerRequest: RegisterRequest): Promise<void> {
        await AuthService.register(registerRequest);
        return null;
    }

    /**
     * @swagger
     * /auth/{id}:
     *   put:
     *     summary: Update user authentication
     *     description: Update user authentication
     *     tags:
     *       - Auth
     *     produces:
     *       - application/json
     *     security:
     *       - BearerToken: []
     *     parameters:
     *       - $ref: '../spec/parameters/users.yml#/userId'
     *       - $ref: '../spec/parameters/auth.yml#/updateAuth'
     *     responses:
     *       204:
     *         $ref: '../spec/common/responses.yml#/EmptySuccessResponse'
     *       422:
     *         $ref: '../spec/common/responses.yml#/InvalidParametersErrorResponse'
     */
    /**
     * @method updateAuth
     * @description Update user credentials API
     * @api {put} /register/{id} Update user profile
     * @return undefined
     */
    @Put("/auth/:id")
    @Authorized()
    public async updateAuth(@Param("id") id: number, @Body() authRequest: UpdateAuthRequest): Promise<void> {
        await AuthService.updateAuth(id, authRequest);
        return null;
    }

    /**
     * @swagger
     * /auth/reset:
     *   post:
     *     summary: Reset user password
     *     description: Reset user password
     *     tags:
     *       - Auth
     *     produces:
     *       - application/json
     *     security:
     *       - BearerToken: []
     *     parameters:
     *       - $ref: '../spec/parameters/auth.yml#/resetUserPassword'
     *     responses:
     *       204:
     *         $ref: '../spec/responses/auth.yml#/ResetUserPasswordSuccessResponse'
     *       404:
     *         $ref: '../spec/common/responses.yml#/MissingParametersErrorResponse'
     */
    /**
     * @method resetAuth
     * @description Reset user password API
     * @api {post} /auth/reset Reset user password
     * @return object new password
     */
    @Post("/auth/reset")
    public async resetAuth(@Body() authResetRequest: ResetAuthRequest): Promise<ResetAuthResponse> {
        return AuthService.resetAuth(authResetRequest);
    }

}

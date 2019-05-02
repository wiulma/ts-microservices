import { Body, Get, JsonController, Param, Post } from "routing-controllers";
import { Inject, Service } from "typedi";
import { Logger } from "../context/components/Logger";
import { HelloResponseMapper } from "../mapper/HelloResponseMapper";

/**
 * HelloWorld Controller
 * @class HelloWorldController
 */
@Service()
@JsonController()
export class HelloWorldController {

    constructor(private logger: Logger) { }

    /**
     * @swagger
     * /hello/{name}:
     *   get:
     *     summary: Get Hello world
     *     description: Get Hello world
     *     tags:
     *       - Hello
     *     produces:
     *       - application/json
     *     parameters:
     *       - $ref: '../spec/parameters/hello.yml#/helloGetName'
     *     responses:
     *       200:
     *         $ref: '../spec/responses/hello.yml#/HelloSuccessResponse'
     */

    /**
     * @method getHello
     * @description Get Hello world
     * @api {get} /hello/{name} Hello name
     * @return say hello or error
     */
    @Get("/hello/:name")
    public async getHello(@Param("name") name: string): Promise<SayHelloResponse> {
        try {
            this.logger.debug(`User ${name} say hello in get mode`);
            return HelloResponseMapper.mapHello({ name, msg: "Get response" });
        } catch (exc) {
            throw exc;
        }
    }

    /**
     * @swagger
     * /hello:
     *   post:
     *     summary: Post Hello world
     *     description: Post Hello world
     *     tags:
     *       - Hello
     *     produces:
     *       - application/json
     *     parameters:
     *       - $ref: '../spec/parameters/hello.yml#/helloPostName'
     *     responses:
     *       200:
     *         $ref: '../spec/responses/hello.yml#/HelloSuccessResponse'
     */
    
    /**
     * @method postHello
     * @description Post Hello world
     * @api {post} /login/ Hello name
     * @return say hello or error
     */
    @Post("/hello")
    public async postHello(@Body() reqUser: HelloUser): Promise<SayHelloResponse> {
        try {
            this.logger.debug(`User ${reqUser.name} logged in`);
            return HelloResponseMapper.mapHello({ name: reqUser.name, msg: "Post response" });
        } catch (exc) {
            throw exc;
        }
    }
}

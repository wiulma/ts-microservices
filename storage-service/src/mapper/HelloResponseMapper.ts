/**
 * @class HelloResponseMapper
 * @name HelloResponseMapper
 * @description Response mapper for say hello API
 */

export const HelloResponseMapper  = {

    /**
     * @method mapHello
     * @description Map say hello response
     * @param {HelloModel} user
     * @return {SayHelloResponse} response
     */
    mapHello: (model: HelloModel): SayHelloResponse => {
        const reply: string = `Hi ${model.name} from ${model.msg}`;
        return {reply};
    }

};

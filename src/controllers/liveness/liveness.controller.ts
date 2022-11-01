import * as express from "express";
import { interfaces, controller, request, response, next, httpGet,  } from "inversify-express-utils";

@controller("/")
export class LivenessController implements interfaces.Controller {

    @httpGet("/")
    public async index(@request() req: express.Request, @response() res: express.Response, @next() nextf: express.NextFunction): Promise<any> {
        return {
            data: 'App is live'
        };
    }
}
import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { inject } from "inversify";
import { getLogger, Logger } from "log4js";
import morgan from "morgan";
import { StatusCodes } from 'http-status-codes';
import { ILoggerService } from ".";
import { IEnvironmentService } from "@config/env";

@provide(TYPE.ILoggerService)
export class LoggerService implements ILoggerService{

    private logger: Logger;

    constructor(
        @inject(TYPE.IEnvironmentService) private environService: IEnvironmentService
    ){
        this.logger = getLogger();
        this.initLogger()
    }

    public initLogger(){
        const level = this.environService.getVariables().loggerlevel;
        this.logger.level = level;
    }

    public debug(message: any){
        this.logger.debug(message);
    }

    public info(message: any){
        this.logger.info(message);
    }

    public error(message: any){
        this.logger.error(message);
    }

    public getMorganMiddleware(){
        const morganMiddleware = morgan(
            ':method :url | Status: :status | Response time: :response-time ms',
            {
                stream:{
                    write: (message: string) => {
                        this.logger.info(message.trim());
                    }
                },
                skip: (req, res)=>{ return res.statusCode !== StatusCodes.OK}
            }
        )

        return morganMiddleware;
    }

}
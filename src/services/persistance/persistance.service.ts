import { IEnvironmentService } from "@config/env";
import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { AttachmentTypes } from "@enums/attachmentTypes.enum";
import { _Location } from "@models/Location";
import { IModels } from "@models/models.interface";
import { ILoggerService } from "@services/logger";
import { createHash } from "@utils/hash.crypto";
import { inject } from "inversify";
import { Sequelize, Op } from "sequelize";
import { IPersistanceService } from ".";

@provide(TYPE.IPersistanceService)
export class PersistanceService implements IPersistanceService{

    public sequelize: Sequelize;
    public operations: any;
    public models: IModels;

    constructor(
        @inject(TYPE.IEnvironmentService) private environService: IEnvironmentService,
        @inject(TYPE.ILoggerService) private logger: ILoggerService
    ){
        const variables = environService.getVariables();
        const parameters: any = {
            dialect: "mysql",
            dialectOptions: {
                ...( variables.databaseSSL && {
                    ssl: {
                        rejectUnauthorized: false,
                        require: true
                    }
                })
            },
            host: variables.databaseHost,
            logging: false,
            protocol: "mysql",
            ssl: variables.databaseSSL
        };
        this.sequelize = new Sequelize(variables.databaseName, variables.databaseUser, variables.databasePassword, parameters);
        this.models = this.initModels();
        this.operations = Op;
    }

    public async initConnection(): Promise<any>{
        await this.sequelize.authenticate();
        if(this.environService.getVariables().migrateDatabase){
            this.logger.info(
            `Migrating models to database...`
            );
            await this.sequelize.sync({ alter: true });
            this.logger.info(
            `Migration finalized`
            );
        }
        this.logger.info(
            `Database started`
        );
    }

    private initModels():IModels{
        const Location = _Location(this.sequelize);
        return {
            Location
        };
    }

}
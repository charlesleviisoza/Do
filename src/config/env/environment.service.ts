import { IEnvironmentService } from ".";
import { environmentSchema, EnvironmentVariables } from "./environmentVariables";
import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";

@provide(TYPE.IEnvironmentService)
export class EnvironmentService implements IEnvironmentService{

    private variables!: EnvironmentVariables;
    private validationError?: Error

    constructor(){
        this.loadEnvironment()
    }

    public loadEnvironment(){
        const validationResult = environmentSchema.validate(process.env);
        if(!validationResult.error){
            this.variables = {
                databaseHost: validationResult.value.DATABASE_HOST,
                databaseName: validationResult.value.DATABASE_NAME,
                databasePassword: validationResult.value.DATABASE_PASSWORD,
                databasePort: validationResult.value.DATABASE_PORT,
                databaseSSL: validationResult.value.DATABASE_SSL === 'TRUE',
                databaseUser: validationResult.value.DATABASE_USER,
                nodeEnv: validationResult.value.NODE_ENV,
                loggerlevel: validationResult.value.LOGGER_LEVEL,
                migrateDatabase: validationResult.value.MIGRATE_DATABASE === 'TRUE',
                port: validationResult.value.PORT,
                rootPath: validationResult.value.ROOT_PATH
            };
        }else{
            this.validationError = validationResult.error
        }
    }

    public getVariables(): EnvironmentVariables{
        return this.variables;
    }

    public getValidationError(){
        return this.validationError
    }
}
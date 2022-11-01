import { IModels } from "@models/models.interface";
import { Sequelize } from "sequelize";

export interface IPersistanceService {

    sequelize: Sequelize;
    operations: any;
    models: IModels;

    initConnection(): Promise<any>;

}
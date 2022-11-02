import { IEnvironmentService } from "@config/env";
import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { InternalServerError } from "@errors/internalServer.error";
import { ItemNoExistsError } from "@errors/itemNoExists.error";
import { ILocation, ILocationSchema, Location } from "@models/Location";
import { IPersistanceService } from "@services/persistance";
import { inject } from "inversify";
import { ILocationService } from ".";

@provide(TYPE.ILocationService)
export class LocationService implements ILocationService{

    constructor(
        @inject(TYPE.IPersistanceService) private persistanceService: IPersistanceService,
        @inject(TYPE.IEnvironmentService) private environmentService: IEnvironmentService
    ){}

    async getLocation(locationId: number): Promise<ILocation | undefined> {
        const location = await this.persistanceService.models.Location.findOne({
            raw: true,
            where: {
                id: locationId
            }
        })
        return location ? this.transformLocation(location) : undefined
    }

    async getAllLocations(): Promise<ILocation[]> {
        const locations = await this.persistanceService.models.Location.findAll({
            raw: true
        });
        return locations.map(this.transformLocation)
    }

    async createLocation(location: ILocationSchema){
        try{
            location.created = (new Date()).toISOString()
            const newLocation = await this.persistanceService.models.Location.create(location)
            return {
                id: newLocation.id
            }
        }catch(err: any){
            throw new InternalServerError('Error creating the entity')
        }
    }

    transformLocation = (location: ILocationSchema): ILocation => {
        const locationResult: ILocation = {
            created: location.created,
            dimension: location.dimension,
            id: location.id,
            name: location.name,
            residents: [],
            type: location.type,
            url: `${this.environmentService.getVariables().hostname}/location/${location.id}`
        }
        return locationResult
    }

}
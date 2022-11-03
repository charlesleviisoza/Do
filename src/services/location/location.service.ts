import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { InternalServerError } from "@errors/internalServer.error";
import { ILocation, ILocationSchema, Location } from "@models/Location";
import { IPersistanceService } from "@services/persistance";
import { inject } from "inversify";
import { ILocationService } from ".";

@provide(TYPE.ILocationService)
export class LocationService implements ILocationService{

    constructor(
        @inject(TYPE.IPersistanceService) private persistanceService: IPersistanceService
    ){}

    async getLocation(locationId: number): Promise<ILocation | undefined> {
        const location = await this.persistanceService.models.Location.findOne({
            raw: true,
            where: {
                id: locationId
            }
        })
        return location ? await this.transformLocation(location) : undefined
    }

    async getAllLocations(): Promise<ILocation[]> {
        const locations = await this.persistanceService.models.Location.findAll({
            raw: true
        });
        return await Promise.all(locations.map(async l => this.transformLocation(l)))
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

    transformLocation = async (location: ILocationSchema): Promise<ILocation> => {
        const characters = await this.persistanceService.models.Character.findAll({
            where: {
                locationId: location.id
            }
        })
        const locationResult: ILocation = {
            created: location.created,
            dimension: location.dimension,
            id: location.id,
            name: location.name,
            residents: characters.map(c => c.id),
            type: location.type
        }
        return locationResult
    }

}
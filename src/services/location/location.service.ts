import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { InternalServerError } from "@errors/internalServer.error";
import { ILocation, ILocationSchema } from "@models/Location";
import { IPersistanceService } from "@services/persistance";
import { IPagination } from "@utils/schemas";
import { inject } from "inversify";
import { ILocationFilters, ILocationService } from ".";

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

    async getAllLocations(filters?:ILocationFilters, pagination?: IPagination): Promise<{count: number, result: ILocation[]}> {
        const locations = await this.persistanceService.models.Location.findAndCountAll({
            raw: true,
            ...(filters && {
                where: {
                    ...filters
                }
            }),
            ...(pagination && {
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit
            })
        });
        return {
            count: locations.count,
            result: await Promise.all(locations.rows.map(async l => this.transformLocation(l)))
        }
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
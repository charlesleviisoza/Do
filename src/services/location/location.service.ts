import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { STATUS } from "@enums/status.enum";
import { InternalServerError } from "@errors/internalServer.error";
import { ILocation, ILocationSchema } from "@models/Location";
import { IPersistanceService } from "@services/persistance";
import { IPagination } from "@utils/schemas";
import { inject } from "inversify";
import { ILocationFilters, ILocationService, ILocationUpdate } from ".";

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

    async getLocations(locationIds: number[]): Promise<ILocation[]> {
        const locations = await this.persistanceService.models.Location.findAll({
            raw: true,
            where: {
                id: locationIds
            }
        })
        return await Promise.all(locations.map(async l => await this.transformLocation(l)))
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

    async deleteLocations(locationIds: number[]): Promise<{locationsDeleted: number}>{
        try{
            const deletedLocations = await this.persistanceService.models.Location.destroy({
                where: {
                    id: locationIds
                }
            })
            return {
                locationsDeleted: deletedLocations
            }
        }catch(err: any){
            throw new InternalServerError('Error deleteting the entities')
        }
    }

    async editLocation(locationId: number, newLocationData: ILocationUpdate): Promise<{status: STATUS}>{
        try{
            const result = await this.persistanceService.models.Location.update(newLocationData,{
                where: {
                    id: locationId
                }
            })
            return {
                status: result[0] > 0 ? STATUS.SUCCESS : STATUS.ERROR
            }
        }catch(err: any){
            throw new InternalServerError('Error updating the entities')
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
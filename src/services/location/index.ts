import { ILocation, ILocationSchema } from "@models/Location"
import { IPagination } from "@utils/schemas"

export interface ILocationFilters {
    name?: string
    type?: string
    dimension?: string
}

export interface ILocationService {
    getAllLocations(filters?:ILocationFilters, pagination?: IPagination): Promise<{count: number, result: ILocation[]}>
    getLocation(locationId: number): Promise<ILocation | undefined>
    createLocation(location: ILocationSchema): Promise<{id: number}>
}
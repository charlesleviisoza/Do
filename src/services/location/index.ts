import { STATUS } from "@enums/status.enum"
import { ILocation, ILocationSchema } from "@models/Location"
import { IPagination } from "@utils/schemas"

export interface ILocationFilters {
    name?: string
    type?: string
    dimension?: string
}

export interface ILocationUpdate {
    name?: string
    type?: string
    dimension?: string
}

export interface ILocationService {
    getAllLocations(filters?:ILocationFilters, pagination?: IPagination): Promise<{count: number, result: ILocation[]}>
    getLocation(locationId: number): Promise<ILocation | undefined>
    getLocations(locationIds: number[]): Promise<ILocation[]>
    createLocation(location: ILocationSchema): Promise<{id: number}>
    deleteLocations(locationIds: number[]): Promise<{locationsDeleted: number}>
    editLocation(locationId: number, newLocationData: ILocationUpdate): Promise<{status: STATUS}>
}
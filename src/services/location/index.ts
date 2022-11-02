import { ILocation, ILocationSchema } from "@models/Location"


export interface ILocationService {
    getAllLocations(): Promise<ILocation[]>
    getLocation(locationId: number): Promise<ILocation | undefined>
    createLocation(location: ILocationSchema): Promise<{id: number}>
}
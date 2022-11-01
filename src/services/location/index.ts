import { ILocation } from "@models/Location"


export interface ILocationService {
    getAllLocations(): Promise<ILocation[]>
    getLocation(locationId: number): Promise<ILocation | undefined>
    createLocation(location: ILocation): Promise<{id: number}>
}
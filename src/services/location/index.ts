import { ILocation } from "@models/Location"


export interface ILocationService {
    getAllLocations(): ILocation[]
    getLocation(locationId: number): ILocation | undefined
    createLocation(location: ILocation): {id: number}
}
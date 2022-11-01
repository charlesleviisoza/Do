import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { ILocation } from "@models/Location";
import { IPersistanceService } from "@services/persistance";
import { inject } from "inversify";
import { ILocationService } from ".";

@provide(TYPE.ILocationService)
export class LocationService implements ILocationService{

    constructor(
        @inject(TYPE.IPersistanceService) private persistanceService: IPersistanceService
    ){}

    getLocation(locationId: number): ILocation | undefined {

        return undefined
    }

    getAllLocations(): ILocation[] {
        // return this.persistanceService.getAllAttachments()
        return []
    }

    createLocation(location: ILocation){
        // const generatedObject = this.persistanceService.createAttachment(attachment)
        return {
            id: 1
        }
    }

}
import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { inject } from "inversify";
import { IResolvers } from "@graphql-tools/utils"
import { IAPIResolver } from "..";
import { ItemNoExistsError } from "@errors/itemNoExists.error";
import { validateJoi } from "@utils/joi";
import { InternalServerError } from "@errors/internalServer.error";
import { ILocationService } from "@services/location";
import { LocationResolverModels } from "./location.resolver.model";

@provide(TYPE.LocationResolver)
export class LocationResolver implements IAPIResolver{

    private typeDefs: string
    private resolvers: IResolvers<any>

    constructor(
        @inject(TYPE.ILocationService) private locationService: ILocationService
    ){
        this.typeDefs = `
            type Query {
                locations: [LocationDetails]
                location(locationId: Int!): LocationDetails
            }

            type Mutation {
                createLocation(location: LocationCreate): LocationCreationResult
            }

            type LocationCreationResult {
                id: Int!
            }

            input LocationCreate {
                name: String!
                type: String!
                dimension: String!
            }

            type LocationDetails {
                id: Int!
                name: String!
                type: String!
                dimension: String!
                residents: [String!]
                url: String!
                created: String!
            }
        `
        this.resolvers = {
            Mutation: {
                createLocation: async (_, {location}) => {
                    const validationResult = validateJoi(LocationResolverModels.create, location)
                    if(!validationResult.valid){
                        throw new InternalServerError(validationResult.error?.message || 'Validation error')
                    }
                    const generatedObject = await this.locationService.createLocation(location)
                    return generatedObject

                }
            },
            Query: {
                location: async (_, {locationId}) => {
                    const result = await this.locationService.getLocation(locationId);
                    if(!result) throw new ItemNoExistsError('Item does not exist')
                    return result
                },
                locations: async () => {
                    return await this.locationService.getAllLocations()
                }
            }
        }
    }

    getTypeDef(): string {
        return this.typeDefs
    }

    getQueryResolvers(): any{
        return this.resolvers.Query
    }

    getMutationResolvers() {
        return this.resolvers.Mutation
    }

}
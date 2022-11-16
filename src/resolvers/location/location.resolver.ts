import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { inject } from "inversify";
import { IResolvers } from "@graphql-tools/utils"
import { IAPIResolver } from "..";
import { ItemNoExistsError } from "@errors/itemNoExists.error";
import { paginationValidator, validateJoi } from "@utils/joi";
import { InternalServerError } from "@errors/internalServer.error";
import { ILocationService } from "@services/location";
import { LocationResolverModels } from "./location.resolver.model";
import { ICharacterService } from "@services/character";
import { IInfoResponse } from "@utils/schemas";
import { ILocation } from "@models/Location";
import { getPaginationInfo } from "@utils/pagination";

@provide(TYPE.LocationResolver)
export class LocationResolver implements IAPIResolver{

    private typeDefs: string
    private resolvers: IResolvers<any>

    constructor(
        @inject(TYPE.ILocationService) private locationService: ILocationService,
        @inject(TYPE.ICharacterService) private characterService: ICharacterService
    ){
        this.typeDefs = `
            """
            List of queries for the GraphQL API
            """
            type Query {
                """
                Get all locations
                """
                locations(filters: LocationFilters, pagination: Pagination): LocationsResult
                """
                Get one location by its id
                """
                location(locationId: Int!): LocationDetails
                """
                Get multiple locations by its ids
                """
                locationsByIds(ids: [Int!]!): [LocationDetails]!
            }

            """
            List of mutations for the GraphQL API
            """
            type Mutation {
                """
                Create a new location
                """
                createLocation(location: LocationCreate): LocationCreationResult
                """
                Delete multiple locations
                """
                deleteLocations(locationIds: [Int!]): LocationDeletionResult
                """
                Edit a location
                """
                editLocation(locationId: Int!, newLocationData: LocationUpdate!): Status
            }

            """
            Result of the location query
            """
            type LocationsResult {
                """
                Infomation of the result
                """
                info: Info!
                """
                Query result
                """
                result: [LocationDetails]!
            }

            """
            Result of the creation of the location
            """
            type LocationCreationResult {
                """
                Generated id of the new location
                """
                id: Int!
            }

            """
            Result of the deletion of multiple locations
            """
            type LocationDeletionResult {
                """
                Number of deleted locations
                """
                locationsDeleted: Int!
            }

            """
            Required information to create a location
            """
            input LocationCreate {
                """
                Location's name
                """
                name: String!
                """
                Location's type
                """
                type: String!
                """
                Location's dimension
                """
                dimension: String!
            }

            """
            Optional information to update a location
            """
            input LocationUpdate {
                """
                Location's name
                """
                name: String
                """
                Location's type
                """
                type: String
                """
                Location's dimension
                """
                dimension: String
            }

            """
            Optional fields to filter the result
            """
            input LocationFilters {
                """
                Location's name
                """
                name: String
                """
                Location's type
                """
                type: String
                """
                Location's dimension
                """
                dimension: String
            }

            """
            Information of a location
            """
            type LocationDetails {
                """
                Location's id
                """
                id: Int!
                """
                Location's name
                """
                name: String!
                """
                Location's type
                """
                type: String!
                """
                Location's dimension
                """
                dimension: String!
                """
                List of residents (characters)
                """
                residents: [CharacterDetails!]
                """
                Location's creation date
                """
                created: String!
            }
        `
        this.resolvers = {
            LocationDetails: {
                residents: async ({ residents }, _) => {
                    const result = await this.characterService.getCharacters(residents);
                    return result
                }
            },
            Mutation: {
                createLocation: async (_, {location}) => {
                    const validationResult = validateJoi(LocationResolverModels.create, location)
                    if(!validationResult.valid){
                        throw new InternalServerError(validationResult.error?.message || 'Validation error')
                    }
                    const generatedObject = await this.locationService.createLocation(location)
                    return generatedObject

                },
                deleteLocations: async (_, {locationIds}) => {
                    const deletedLocations = await this.locationService.deleteLocations(locationIds)
                    return deletedLocations
                },
                editLocation: async (_, {locationId, newLocationData}) => {
                    const validationResult = validateJoi(LocationResolverModels.update, newLocationData)
                    if(!validationResult.valid){
                        throw new InternalServerError(validationResult.error?.message || 'Validation error')
                    }
                    const result = await this.locationService.editLocation(locationId, newLocationData)
                    return result
                }
            },
            Query: {
                location: async (_, {locationId}) => {
                    const result = await this.locationService.getLocation(locationId);
                    if(!result) throw new ItemNoExistsError('Item does not exist')
                    return result
                },
                locations: async (_, {filters, pagination}) => {
                    const validationResult = validateJoi(LocationResolverModels.filters, filters)
                    if(!validationResult.valid){
                        throw new InternalServerError(validationResult.error?.message || 'Validation error')
                    }
                    const validationResultPaginator = validateJoi(paginationValidator(), pagination)
                    if(!validationResultPaginator.valid){
                        throw new InternalServerError(validationResultPaginator.error?.message || 'Validation error')
                    }
                    const locations = await this.locationService.getAllLocations(filters, pagination)
                    const result: IInfoResponse<ILocation> = {
                        info: {
                            count: locations.count,
                            ...(pagination && getPaginationInfo(pagination.page, pagination.limit, locations.count))
                        },
                        result: locations.result
                    }
                    return result
                },
                locationsByIds: async (_, {ids}) => {
                    const result = await this.locationService.getLocations(ids);
                    return result
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

    getResolvers() {
        return this.resolvers
    }

}
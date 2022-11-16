import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { inject } from "inversify";
import { IResolvers } from "@graphql-tools/utils"
import { IAPIResolver } from "..";
import { paginationValidator, validateJoi } from "@utils/joi";
import { InternalServerError } from "@errors/internalServer.error";
import { ICharacterService } from "@services/character";
import { CharacterResolverModels } from "./character.resolver.model";
import { ItemNoExistsError } from "@errors/itemNoExists.error";
import { ILocationService } from "@services/location";
import { IEpisodeService } from "@services/episode";
import { IInfoResponse } from "@utils/schemas";
import { ICharacter } from "@models/Character";
import { getPaginationInfo } from "@utils/pagination";

@provide(TYPE.CharacterResolver)
export class CharacterResolver implements IAPIResolver{

    private typeDefs: string
    private resolvers: IResolvers<any>

    constructor(
        @inject(TYPE.ILocationService) private locationService: ILocationService,
        @inject(TYPE.ICharacterService) private characterService: ICharacterService,
        @inject(TYPE.IEpisodeService) private episodeService: IEpisodeService
    ){
        this.typeDefs = `

            type Query {
                """
                Get all characters
                """
                characters(filters: CharacterFilters, pagination: Pagination): CharactersResult!
                """
                Get one character by its id
                """
                character(characterId: Int!): CharacterDetails
                """
                Get multiple characters by its ids
                """
                charactersByIds(ids: [Int!]!): [CharacterDetails]!
            }

            type Mutation {
                """
                Create a new character
                """
                createCharacter(character: CharacterCreate): CharacterCreationResult
                """
                Delete multiple characters
                """
                deleteCharacters(characterIds: [Int!]): CharacterDeletionResult
            }

            """
            Result of the location query
            """
            type CharactersResult {
                """
                Infomation of the result
                """
                info: Info!
                """
                Query result
                """
                result: [CharacterDetails]!
            }

            """
            Result of the creation of the character
            """
            type CharacterCreationResult {
                """
                Generated id of the new character
                """
                id: Int!
            }

            """
            Result of the deletion of multiple characters
            """
            type CharacterDeletionResult {
                """
                Number of deleted characters
                """
                charactersDeleted: Int!
            }

            """
            Required information to create a character
            """
            input CharacterCreate {
                """
                Character's name
                """
                name: String!
                """
                Character's type
                """
                type: String!
                """
                Character's status
                """
                status: String!
                """
                Character's species
                """
                species: String!
                """
                Character's gender
                """
                gender: String!
                """
                Character's image
                """
                image: String!
                """
                Character's origin location's id
                """
                originId: Int!
                """
                Character's current location's id
                """
                locationId: Int!
            }

            """
            Optional fields to filter the result
            """
            input CharacterFilters {
                """
                Character's name
                """
                name: String
                """
                Character's status
                """
                status: String
                """
                Character's species
                """
                species: String
                """
                Character's type
                """
                type: String
                """
                Character's gender
                """
                gender: String
            }

            """
            Information of a character
            """
            type CharacterDetails {
                """
                Character's id
                """
                id: Int!
                """
                Character's name
                """
                name: String!
                """
                Character's type
                """
                type: String!
                """
                Character's status
                """
                status: String!
                """
                Character's species
                """
                species: String!
                """
                Character's gender
                """
                gender: String!
                """
                Character's image
                """
                image: String!
                """
                Character's origin location
                """
                origin: LocationDetails!
                """
                Character's current location
                """
                location: LocationDetails!
                """
                List of episodes in which the character appears
                """
                episodes: [EpisodeDetails!]
            }
        `
        this.resolvers = {
            CharacterDetails: {
                episodes: async ({ episodes }, _) => {
                    const result = await this.episodeService.getEpisodes(episodes);
                    return result
                },
                location: async ({ location }, _) => {
                    const result = await this.locationService.getLocation(location);
                    if(!result) throw new ItemNoExistsError('Item does not exist')
                    return result
                },
                origin: async ({ origin }, _) => {
                    const result = await this.locationService.getLocation(origin);
                    if(!result) throw new ItemNoExistsError('Item does not exist')
                    return result
                }
            },
            Mutation: {
                createCharacter: async (_, {character}) => {
                    const validationResult = validateJoi(CharacterResolverModels.create, character)
                    if(!validationResult.valid){
                        throw new InternalServerError(validationResult.error?.message || 'Validation error')
                    }
                    const generatedObject = await this.characterService.createCharacter(character)
                    return generatedObject
                },
                deleteCharacters: async (_, {characterIds}) => {
                    const deletedCharacters = await this.characterService.deleteCharacters(characterIds)
                    return deletedCharacters
                }
            },
            Query: {
                character: async (_, {characterId}) => {
                    const result = await this.characterService.getCharacter(characterId);
                    if(!result) throw new ItemNoExistsError('Item does not exist')
                    return result
                },
                characters: async (_, {filters, pagination}) => {
                    const validationResult = validateJoi(CharacterResolverModels.filters, filters)
                    if(!validationResult.valid){
                        throw new InternalServerError(validationResult.error?.message || 'Validation error')
                    }
                    const validationResultPaginator = validateJoi(paginationValidator(), pagination)
                    if(!validationResultPaginator.valid){
                        throw new InternalServerError(validationResultPaginator.error?.message || 'Validation error')
                    }
                    const characters = await this.characterService.getAllCharacters(filters, pagination)
                    const result: IInfoResponse<ICharacter> = {
                        info: {
                            count: characters.count,
                            ...(pagination && getPaginationInfo(pagination.page, pagination.limit, characters.count))
                        },
                        result: characters.result
                    }
                    return result
                },
                charactersByIds: async (_, {ids}) => {
                    const result = await this.characterService.getCharacters(ids);
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
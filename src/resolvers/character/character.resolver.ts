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
                characters(filters: CharacterFilters, pagination: Pagination): CharactersResult!
                character(characterId: Int!): CharacterDetails
                charactersByIds(ids: [Int!]!): [CharacterDetails]!
            }

            type Mutation {
                createCharacter(character: CharacterCreate): CharacterCreationResult
                deleteCharacters(characterIds: [Int!]): CharacterDeletionResult
            }

            type CharactersResult {
                info: Info!
                result: [CharacterDetails]!
            }

            type CharacterCreationResult {
                id: Int!
            }

            type CharacterDeletionResult {
                charactersDeleted: Int!
            }

            input CharacterFilters {
                name: String
                status: String
                species: String
                type: String
                gender: String
            }

            input CharacterCreate {
                name: String!
                type: String!
                status: String!
                species: String!
                gender: String!
                image: String!
                originId: Int!
                locationId: Int!
            }

            type CharacterDetails {
                id: Int!
                name: String!
                type: String!
                status: String!
                species: String!
                gender: String!
                image: String!
                origin: LocationDetails!
                location: LocationDetails!
                episode: [EpisodeDetails!]
            }
        `
        this.resolvers = {
            CharacterDetails: {
                episode: async ({ episode }, _) => {
                    const result = await this.episodeService.getEpisodes(episode);
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
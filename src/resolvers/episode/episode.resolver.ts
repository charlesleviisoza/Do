import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { inject } from "inversify";
import { IResolvers } from "@graphql-tools/utils"
import { IAPIResolver } from "..";
import { paginationValidator, validateJoi } from "@utils/joi";
import { InternalServerError } from "@errors/internalServer.error";
import { EpisodeResolverModels } from "./episode.resolver.model";
import { IEpisodeService } from "@services/episode";
import { ItemNoExistsError } from "@errors/itemNoExists.error";
import { ICharacterService } from "@services/character";
import { IInfoResponse } from "@utils/schemas";
import { IEpisode } from "@models/Episode";
import { getPaginationInfo } from "@utils/pagination";

@provide(TYPE.EpisodeResolver)
export class EpisodeResolver implements IAPIResolver{

    private typeDefs: string
    private resolvers: IResolvers<any>

    constructor(
        @inject(TYPE.IEpisodeService) private episodeService: IEpisodeService,
        @inject(TYPE.ICharacterService) private characterService: ICharacterService
    ){
        this.typeDefs = `

            type Query {
                episodes(filters: EpisodeFilters, pagination: Pagination): EpisodesResult!
                episode(episodeId: Int!): EpisodeDetails
                episodesByIds(ids: [Int!]!): [EpisodeDetails]!
            }

            type Mutation {
                associateEpisodeCharacter(episodeId: Int!, characterId: Int!): Status
                createEpisode(episode: EpisodeCreate): EpisodeCreationResult
                deleteEpisodes(episodeIds: [Int!]): EpisodeDeletionResult
            }

            type EpisodesResult {
                info: Info!
                result: [EpisodeDetails]!
            }

            type EpisodeCreationResult {
                id: Int!
            }

            type EpisodeDeletionResult {
                episodesDeleted: Int!
            }

            input EpisodeFilters {
                name: String
                episode: String
            }

            input EpisodeCreate {
                name: String!
                air_date: String!
                episode: String!
            }

            type EpisodeDetails {
                id: Int!
                name: String!
                air_date: String!
                episode: String!
                characters: [CharacterDetails]!
                created: String!
            }
        `
        this.resolvers = {
            EpisodeDetails: {
                characters: async ({ characters }, _) => {
                    const result = await this.characterService.getCharacters(characters);
                    return result
                }
            },
            Mutation: {
                associateEpisodeCharacter: async (_, { episodeId, characterId }) => {
                    const result = await this.episodeService.associateEpisodeCharacter(episodeId, characterId)
                    return result
                },
                createEpisode: async (_, {episode}) => {
                    const validationResult = validateJoi(EpisodeResolverModels.create, episode)
                    if(!validationResult.valid){
                        throw new InternalServerError(validationResult.error?.message || 'Validation error')
                    }
                    const generatedObject = await this.episodeService.createEpisode(episode)
                    return generatedObject
                },
                deleteEpisodes: async (_, {episodeIds}) => {
                    const deletedEpisodes = await this.episodeService.deleteEpisodes(episodeIds)
                    return deletedEpisodes
                }
            },
            Query: {
                episode: async (_, {episodeId}) => {
                    const result = await this.episodeService.getEpisode(episodeId);
                    if(!result) throw new ItemNoExistsError('Item does not exist')
                    return result
                },
                episodes: async (_, {filters, pagination}) => {
                    const validationResult = validateJoi(EpisodeResolverModels.filters, filters)
                    if(!validationResult.valid){
                        throw new InternalServerError(validationResult.error?.message || 'Validation error')
                    }
                    const validationResultPaginator = validateJoi(paginationValidator(), pagination)
                    if(!validationResultPaginator.valid){
                        throw new InternalServerError(validationResultPaginator.error?.message || 'Validation error')
                    }
                    const episodes = await this.episodeService.getAllEpisodes(filters, pagination)
                    const result: IInfoResponse<IEpisode> = {
                        info: {
                            count: episodes.count,
                            ...(pagination && getPaginationInfo(pagination.page, pagination.limit, episodes.count))
                        },
                        result: episodes.result
                    }
                    return result
                },
                episodesByIds: async (_, {ids}) => {
                    const result = await this.episodeService.getEpisodes(ids);
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
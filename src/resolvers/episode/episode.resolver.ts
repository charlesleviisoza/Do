import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { inject } from "inversify";
import { IResolvers } from "@graphql-tools/utils"
import { IAPIResolver } from "..";
import { validateJoi } from "@utils/joi";
import { InternalServerError } from "@errors/internalServer.error";
import { EpisodeResolverModels } from "./episode.resolver.model";
import { IEpisodeService } from "@services/episode";
import { ItemNoExistsError } from "@errors/itemNoExists.error";
import { ICharacterService } from "@services/character";

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
                episodes: [EpisodeDetails]!
                episode(episodeId: Int!): EpisodeDetails
            }

            type Mutation {
                createEpisode(episode: EpisodeCreate): EpisodeCreationResult
                associateEpisodeCharacter(episodeId: Int!, characterId: Int!): Status
            }

            type EpisodeCreationResult {
                id: Int!
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
                }
            },
            Query: {
                episode: async (_, {episodeId}) => {
                    const result = await this.episodeService.getEpisode(episodeId);
                    if(!result) throw new ItemNoExistsError('Item does not exist')
                    return result
                },
                episodes: async () => {
                    return await this.episodeService.getAllEpisodes()
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
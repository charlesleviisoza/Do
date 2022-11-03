import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { inject } from "inversify";
import { IResolvers } from "@graphql-tools/utils"
import { IAPIResolver } from "..";
import { validateJoi } from "@utils/joi";
import { InternalServerError } from "@errors/internalServer.error";
import { ICharacterService } from "@services/character";
import { CharacterResolverModels } from "./character.resolver.model";
import { ItemNoExistsError } from "@errors/itemNoExists.error";
import { ILocationService } from "@services/location";
import { IEpisodeService } from "@services/episode";

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
                characters: [CharacterDetails]!
                character(characterId: Int!): CharacterDetails
            }

            type Mutation {
                createCharacter(character: CharacterCreate): CharacterCreationResult
            }

            type CharacterCreationResult {
                id: Int!
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

                }
            },
            Query: {
                character: async (_, {characterId}) => {
                    const result = await this.characterService.getCharacter(characterId);
                    if(!result) throw new ItemNoExistsError('Item does not exist')
                    return result
                },
                characters: async () => {
                    return await this.characterService.getAllCharacters()
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
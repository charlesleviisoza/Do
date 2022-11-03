import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { InternalServerError } from "@errors/internalServer.error";
import { ICharacter, ICharacterSchema } from "@models/Character";
import { IPersistanceService } from "@services/persistance";
import { inject } from "inversify";
import { ICharacterService } from ".";

@provide(TYPE.ICharacterService)
export class CharacterService implements ICharacterService{

    constructor(
        @inject(TYPE.IPersistanceService) private persistanceService: IPersistanceService
    ){}

    async getCharacter(characterId: number): Promise<ICharacter | undefined> {
        const character = await this.persistanceService.models.Character.findOne({
            raw: true,
            where: {
                id: characterId
            }
        })
        return character ? await this.transformCharacter(character) : undefined
    }

    async getCharacters(characterIds: number[]): Promise<ICharacter[]> {
        const characters = await this.persistanceService.models.Character.findAll({
            raw: true,
            where: {
                id: characterIds
            }
        })
        return await Promise.all(characters.map(async c => this.transformCharacter(c)))
    }

    async getAllCharacters(): Promise<ICharacter[]> {
        const characters = await this.persistanceService.models.Character.findAll({
            raw: true
        });
        return await Promise.all(characters.map(async c => this.transformCharacter(c)))
    }

    async createCharacter(character: ICharacterSchema){
        try{
            character.created = (new Date()).toISOString()
            const newCharacter = await this.persistanceService.models.Character.create(character)
            return {
                id: newCharacter.id
            }
        }catch(err: any){
            throw new InternalServerError('Error creating the entity')
        }
    }

    transformCharacter = async (character: ICharacterSchema): Promise<ICharacter> => {
        const episodes = await this.persistanceService.models.EpisodeCharacter.findAll({
            raw: true,
            where: {
                characterId: character.id
            }
        })
        const characterResult: ICharacter = {
            created: character.created,
            episode: episodes.map(e=>e.episodeId),
            gender: character.gender,
            id: character.id,
            image: character.image,
            location: (character as any).locationId,
            name: character.name,
            origin: (character as any).originId,
            species: character.species,
            status: character.status,
            type: character.type
        }
        return characterResult
    }

}
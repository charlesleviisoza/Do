import { IEnvironmentService } from "@config/env";
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
        @inject(TYPE.IPersistanceService) private persistanceService: IPersistanceService,
        @inject(TYPE.IEnvironmentService) private environmentService: IEnvironmentService
    ){}

    async getCharacter(characterId: number): Promise<ICharacter | undefined> {
        const character = await this.persistanceService.models.Character.findOne({
            include: [
                {
                    as: 'origin',
                    attributes: ['id','name','type','dimension'],
                    model: this.persistanceService.models.Location
                },
                {
                    as: 'location',
                    attributes: ['id','name','type','dimension'],
                    model: this.persistanceService.models.Location
                }
            ],
            raw: true,
            where: {
                id: characterId
            }
        })
        return character ? await this.transformCharacter(character) : undefined
    }

    async getAllCharacters(): Promise<ICharacter[]> {
        const characters = await this.persistanceService.models.Character.findAll({
            include: [
                {
                    as: 'origin',
                    attributes: ['id','name','type','dimension'],
                    model: this.persistanceService.models.Location
                },
                {
                    as: 'location',
                    attributes: ['id','name','type','dimension'],
                    model: this.persistanceService.models.Location
                }
            ],
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
            include:{
                as: 'episode',
                attributes: ['id'],
                model: this.persistanceService.models.Episode
            },
            raw: true,
            where: {
                characterId: character.id
            }
        })
        const characterResult: ICharacter = {
            created: character.created,
            episode: episodes.map(e=>`${this.environmentService.getVariables().hostname}/episode/${(e as any)['episode.id']}`),
            gender: character.gender,
            id: character.id,
            image: character.image,
            location: {
                name: (character as any)['location.name'] || null,
                url: `${this.environmentService.getVariables().hostname}/location/${(character as any)['location.id']}`
            },
            name: character.name,
            origin: {
                name: (character as any)['origin.name'] || null,
                url: `${this.environmentService.getVariables().hostname}/location/${(character as any)['origin.id']}`
            },
            species: character.species,
            status: character.status,
            type: character.type
        }
        return characterResult
    }

}
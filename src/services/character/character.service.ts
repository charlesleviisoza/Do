import { IEnvironmentService } from "@config/env";
import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { InternalServerError } from "@errors/internalServer.error";
import { ItemNoExistsError } from "@errors/itemNoExists.error";
import { ICharacter, ICharacterSchema } from "@models/Character";
import { ILocation, ILocationSchema, Location } from "@models/Location";
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
            raw: true,
            where: {
                id: characterId
            }
        })
        return character ? this.transformCharacter(character) : undefined
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
        return characters.map(this.transformCharacter)
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

    transformCharacter = (character: ICharacterSchema): ICharacter => {
        const characterResult: ICharacter = {
            created: character.created,
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
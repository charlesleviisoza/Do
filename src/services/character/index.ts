import { ICharacter, ICharacterSchema } from "@models/Character"
import { ILocation, ILocationSchema } from "@models/Location"


export interface ICharacterService {
    getAllCharacters(): Promise<ICharacter[]>
    getCharacter(characterId: number): Promise<ICharacter | undefined>
    getCharacters(characterIds: number[]): Promise<ICharacter[]>
    createCharacter(character: ICharacterSchema): Promise<{id: number}>
}
import { ICharacter, ICharacterSchema } from "@models/Character"
import { IPagination } from "@utils/schemas"

export interface ICharacterFilters {
    name?: string
    status?: string
    species?: string
    type?: string
    gender?: string
}

export interface ICharacterService {
    getAllCharacters(filters?:ICharacterFilters, pagination?: IPagination): Promise<{count: number, result: ICharacter[]}>
    getCharacter(characterId: number): Promise<ICharacter | undefined>
    getCharacters(characterIds: number[]): Promise<ICharacter[]>
    createCharacter(character: ICharacterSchema): Promise<{id: number}>
}
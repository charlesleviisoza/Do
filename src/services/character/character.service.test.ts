import 'reflect-metadata';
import { getSampleServices, mockCharacter, mockHelpers } from '@utils/environment.sample';

describe('Character tests', ()=>{

    const sampleEnviron = getSampleServices()

    test('Character service construction', ()=>{

        expect(sampleEnviron.characterService).toBeDefined()

    })

    test('Get one character', async ()=>{
        try{
            const result = await sampleEnviron.characterService.getCharacter(mockHelpers.mockId)
            expect(result).toEqual(mockCharacter.transformed)
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

    test('Get characters by ids', async ()=>{
        try{
            const result = await sampleEnviron.characterService.getCharacters([mockHelpers.mockId])
            expect(result).toEqual([mockCharacter.transformed])
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

    test('Get all characters', async ()=>{
        try{
            const result = await sampleEnviron.characterService.getAllCharacters()
            expect(result).toEqual({
                count: 1,
                result: [mockCharacter.transformed]
            })
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

    test('Create character', async ()=>{
        try{
            const result = await sampleEnviron.characterService.createCharacter(mockCharacter.raw)
            expect(result).toEqual({
                id: mockHelpers.mockId
            })
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

    test('Delete characters', async ()=>{
        try{
            const result = await sampleEnviron.characterService.deleteCharacters([mockHelpers.mockId])
            expect(result).toEqual({
                charactersDeleted: 1
            })
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

})
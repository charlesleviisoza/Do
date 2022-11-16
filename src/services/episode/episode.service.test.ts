import 'reflect-metadata';
import { getSampleServices, mockEpisode, mockHelpers } from '@utils/environment.sample';
import { STATUS } from '@enums/status.enum';

describe('Episode tests', ()=>{

    const sampleEnviron = getSampleServices()

    test('Episode service construction', ()=>{

        expect(sampleEnviron.episodeService).toBeDefined()

    })

    test('Get one episode', async ()=>{
        try{
            const result = await sampleEnviron.episodeService.getEpisode(mockHelpers.mockId)
            expect(result).toEqual(mockEpisode.transformed)
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

    test('Get episodes by ids', async ()=>{
        try{
            const result = await sampleEnviron.episodeService.getEpisodes([mockHelpers.mockId])
            expect(result).toEqual([mockEpisode.transformed])
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

    test('Get all episodes', async ()=>{
        try{
            const result = await sampleEnviron.episodeService.getAllEpisodes()
            expect(result).toEqual({
                count: 1,
                result: [mockEpisode.transformed]
            })
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

    test('Create episode', async ()=>{
        try{
            const result = await sampleEnviron.episodeService.createEpisode(mockEpisode.raw)
            expect(result).toEqual({
                id: mockHelpers.mockId
            })
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

    test('Delete episodes', async ()=>{
        try{
            const result = await sampleEnviron.episodeService.deleteEpisodes([mockHelpers.mockId])
            expect(result).toEqual({
                episodesDeleted: 1
            })
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

    test('Associate episode and character', async ()=>{
        try{
            const result = await sampleEnviron.episodeService.associateEpisodeCharacter(mockHelpers.mockId, mockHelpers.mockId)
            expect(result).toEqual({
                status: STATUS.SUCCESS
            })
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

})
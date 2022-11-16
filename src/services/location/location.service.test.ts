import 'reflect-metadata';
import { getSampleServices, mockHelpers, mockLocation } from '@utils/environment.sample';
import { STATUS } from '@enums/status.enum';

describe('Location service tests', ()=>{

    const sampleEnviron = getSampleServices()

    test('Location service construction', ()=>{

        expect(sampleEnviron.locationService).toBeDefined()

    })

    test('Get one location', async ()=>{
        try{
            const result = await sampleEnviron.locationService.getLocation(mockHelpers.mockId)
            expect(result).toEqual(mockLocation.transformed)
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

    test('Get locations by ids', async ()=>{
        try{
            const result = await sampleEnviron.locationService.getLocations([mockHelpers.mockId])
            expect(result).toEqual([mockLocation.transformed])
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

    test('Get all locations', async ()=>{
        try{
            const result = await sampleEnviron.locationService.getAllLocations()
            expect(result).toEqual({
                count: 1,
                result: [mockLocation.transformed]
            })
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

    test('Create location', async ()=>{
        try{
            const result = await sampleEnviron.locationService.createLocation(mockLocation.raw)
            expect(result).toEqual({
                id: mockHelpers.mockId
            })
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

    test('Delete locations', async ()=>{
        try{
            const result = await sampleEnviron.locationService.deleteLocations([mockHelpers.mockId])
            expect(result).toEqual({
                locationsDeleted: 1
            })
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

    test('Edit location', async ()=>{
        try{
            const result = await sampleEnviron.locationService.editLocation(mockHelpers.mockId, mockLocation.raw)
            expect(result).toEqual({
                status: STATUS.SUCCESS
            })
        }catch(err){
            expect(err).toBeFalsy()
        }
    })

})
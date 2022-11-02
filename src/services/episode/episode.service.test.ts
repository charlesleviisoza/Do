import 'reflect-metadata';
import { getSampleServices } from '@utils/environment.sample';

describe('Persistance tests', ()=>{

    test('Persistance construction', ()=>{

        const sampleEnviron = getSampleServices()
        expect(sampleEnviron.persistanceService).toBeDefined()

    })

})
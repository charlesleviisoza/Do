import 'reflect-metadata';
import { EnvironmentService } from "@config/env/environment.service";
import { LoggerService } from "./logger.service";
import { SAMPLE_ENVIRONMENT } from '@utils/environment.sample';

describe('Logger tests', ()=>{

    test('Logger construction', ()=>{

        const environService: EnvironmentService = new EnvironmentService();
        environService.getVariables = jest.fn(()=>SAMPLE_ENVIRONMENT);
        const loggerService: LoggerService= new LoggerService(environService);
        expect(loggerService).toBeDefined();

    })

})
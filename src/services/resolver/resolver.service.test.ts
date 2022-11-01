import 'reflect-metadata';
import { EnvironmentService } from "@config/env/environment.service";
import { getSampleServices, SAMPLE_ENVIRONMENT } from '@utils/environment.sample';
import { ILoggerService } from '@services/logger';
import { LoggerService } from '@services/logger/logger.service';
import { ResolverService } from './resolver.service';
import { IAPIResolver } from '@resolvers/index';

describe('Resolver tests', ()=>{

    test('Resolver construction', ()=>{

        const sampleEnviron = getSampleServices()
        expect(sampleEnviron.persistanceService).toBeDefined()
        expect(sampleEnviron.resolverService).toBeDefined();

    })

})
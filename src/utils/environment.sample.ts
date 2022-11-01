import { EnvironmentService } from "@config/env/environment.service";
import { EnvironmentVariables } from "@config/env/environmentVariables";
import { AttachmentResolver } from "@resolvers/location/location.resolver";
import { LocationService } from "@services/location/location.service";
import { LoggerService } from "@services/logger/logger.service";
import { PersistanceService } from "@services/persistance/persistance.service";
import { ResolverService } from "@services/resolver/resolver.service";

export interface SampleServices{
    environService: EnvironmentService
    persistanceService: PersistanceService
    locationService: LocationService
    studentsResolver: AttachmentResolver
    resolverService: ResolverService
}

export const SAMPLE_ENVIRONMENT: EnvironmentVariables = {
    databaseHost: 'test',
    databaseName: 'test',
    databasePassword: 'test',
    databasePort: 'test',
    databaseSSL: false,
    databaseUser: 'test',
    port: '3000',
    loggerlevel: 'OFF',
    migrateDatabase: false,
    nodeEnv: 'develoment',
    rootPath: '/api'
}

export const getSampleServices = ():SampleServices => {
    const environService: EnvironmentService = new EnvironmentService();
    environService.getVariables = jest.fn(()=>SAMPLE_ENVIRONMENT);
    const loggerService: LoggerService = new LoggerService(environService);
    const persistanceService: PersistanceService = new PersistanceService(environService, loggerService);
    const locationService: LocationService = new LocationService(persistanceService);
    const studentsResolver: AttachmentResolver = new AttachmentResolver(locationService);
    const resolverService: ResolverService = new ResolverService(studentsResolver);

    return {
        environService,
        persistanceService,
        locationService,
        studentsResolver,
        resolverService
    }
}
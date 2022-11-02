import { EnvironmentService } from "@config/env/environment.service";
import { IEnvironmentVariables } from "@config/env/environmentVariables";
import { CharacterResolver } from "@resolvers/character/character.resolver";
import { EpisodeResolver } from "@resolvers/episode/episode.resolver";
import { LocationResolver } from "@resolvers/location/location.resolver";
import { CharacterService } from "@services/character/character.service";
import { EpisodeService } from "@services/episode/episode.service";
import { LocationService } from "@services/location/location.service";
import { LoggerService } from "@services/logger/logger.service";
import { PersistanceService } from "@services/persistance/persistance.service";
import { ResolverService } from "@services/resolver/resolver.service";

export interface ISampleServices{
    environService: EnvironmentService
    locationResolver: LocationResolver
    locationService: LocationService
    persistanceService: PersistanceService
    resolverService: ResolverService
}

export const SAMPLE_ENVIRONMENT: IEnvironmentVariables = {
    databaseHost: 'test',
    databaseName: 'test',
    databasePassword: 'test',
    databasePort: 'test',
    databaseSSL: false,
    databaseUser: 'test',
    hostname: 'test',
    loggerlevel: 'OFF',
    migrateDatabase: false,
    nodeEnv: 'develoment',
    port: '3000',
    rootPath: '/api'
}

export const getSampleServices = (): ISampleServices => {
    const environService: EnvironmentService = new EnvironmentService();
    environService.getVariables = jest.fn(()=>SAMPLE_ENVIRONMENT);
    const loggerService: LoggerService = new LoggerService(environService);
    const persistanceService: PersistanceService = new PersistanceService(environService, loggerService);
    const locationService: LocationService = new LocationService(persistanceService, environService);
    const locationResolver: LocationResolver = new LocationResolver(locationService);
    const characterService: CharacterService = new CharacterService(persistanceService, environService)
    const characterResolver: CharacterResolver = new CharacterResolver(characterService)
    const episodeService: EpisodeService = new EpisodeService(persistanceService, environService)
    const episodeResolver: EpisodeResolver = new EpisodeResolver(episodeService)
    const resolverService: ResolverService = new ResolverService(locationResolver, characterResolver, episodeResolver);

    return {
        environService,
        locationResolver,
        locationService,
        persistanceService,
        resolverService
    }
}
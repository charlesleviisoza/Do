import { EnvironmentService } from "@config/env/environment.service";
import { IEnvironmentVariables } from "@config/env/environmentVariables";
import { ICharacter, ICharacterSchema } from "@models/Character";
import { IEpisode, IEpisodeSchema } from "@models/Episode";
import { IEpisodeCharacterSchema } from "@models/EpisodeCharacter";
import { ILocation, ILocationSchema } from "@models/Location";
import { CharacterResolver } from "@resolvers/character/character.resolver";
import { EpisodeResolver } from "@resolvers/episode/episode.resolver";
import { LocationResolver } from "@resolvers/location/location.resolver";
import { CharacterService } from "@services/character/character.service";
import { EpisodeService } from "@services/episode/episode.service";
import { LocationService } from "@services/location/location.service";
import { LoggerService } from "@services/logger/logger.service";
import { PersistanceService } from "@services/persistance/persistance.service";
import { ResolverService } from "@services/resolver/resolver.service";

export const mockHelpers = {
    mockId: 1
}

export const mockLocation: {raw: ILocationSchema, transformed: ILocation} = {
    raw: {
        created: '2022-01-01',
        dimension: 'Normal',
        id: mockHelpers.mockId,
        name: 'Name',
        type: 'City'
    },
    transformed: {
        created: '2022-01-01',
        dimension: 'Normal',
        id: mockHelpers.mockId,
        name: 'Name',
        // Id of the mock character
        residents: [mockHelpers.mockId],
        type: 'City'
    }
}

export const mockCharacter: {raw: ICharacterSchema, transformed: ICharacter} = {
    raw: {
        created: '2022-01-01',
        gender: 'Male',
        id: mockHelpers.mockId,
        image: 'img1',
        // Id of the mock location
        locationId: mockHelpers.mockId,
        name: 'Character',
        // Id of the mock location
        originId: mockHelpers.mockId,
        species: 'Human',
        status: 'ACTIVE',
        type: 'Human'
    },
    transformed: {
        created: '2022-01-01',
        // Id of the mock episode
        episodes: [mockHelpers.mockId],
        gender: 'Male',
        id: mockHelpers.mockId,
        image: 'img1',
        // Id of the mock location
        location: mockHelpers.mockId,
        name: 'Character',
        // Id of the mock location
        origin: mockHelpers.mockId,
        species: 'Human',
        status: 'ACTIVE',
        type: 'Human'
    }
}

export const mockEpisode: {raw: IEpisodeSchema, transformed: IEpisode} = {
    raw: {
        air_date: '2022-01-01',
        created: '2022-01-01',
        episode: 'PIL-001',
        id: mockHelpers.mockId,
        name: 'Pilot'
    },
    transformed: {
        air_date: '2022-01-01',
        // Id of the mock character
        characters: [mockHelpers.mockId],
        created: '2022-01-01',
        episode: 'PIL-001',
        id: mockHelpers.mockId,
        name: 'Pilot'
    }
}

const mockAssociation: IEpisodeCharacterSchema = {
    characterId: mockHelpers.mockId,
    episodeId: mockHelpers.mockId
}

export const mockDatabaseModels: any = {
    Character: {
        create: jest.fn(()=>mockCharacter.raw),
        destroy: jest.fn(()=>1),
        findAll: jest.fn(() => ([mockCharacter.raw])),
        findAndCountAll: jest.fn(() => ({count: 1, rows: [mockCharacter.raw]})),
        findOne: jest.fn(() => mockCharacter.raw),
        update: jest.fn(()=>[1])
    },
    Episode: {
        create: jest.fn(()=>mockEpisode.raw),
        destroy: jest.fn(()=>1),
        findAll: jest.fn(() => ([mockEpisode.raw])),
        findAndCountAll: jest.fn(() => ({count: 1, rows: [mockEpisode.raw]})),
        findOne: jest.fn(() => mockEpisode.raw),
        update: jest.fn(()=>[1])
    },
    EpisodeCharacter: {
        create: jest.fn(()=>mockAssociation),
        findAll: jest.fn(() => ([mockAssociation])),
        findOne: jest.fn(() => mockAssociation)
    },
    Location: {
        create: jest.fn(()=>mockLocation.raw),
        destroy: jest.fn(()=>1),
        findAll: jest.fn(() => ([mockLocation.raw])),
        findAndCountAll: jest.fn(() => ({count: 1, rows: [mockLocation.raw]})),
        findOne: jest.fn(() => mockLocation.raw),
        update: jest.fn(()=>[1])
    }
}

export interface ISampleServices{
    characterService: CharacterService
    environService: EnvironmentService
    episodeService: EpisodeService
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
    graphqlUi: true,
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
    const persistanceService: PersistanceService = initPersistanceService(environService, loggerService)
    const characterService: CharacterService = new CharacterService(persistanceService)
    const locationService: LocationService = new LocationService(persistanceService);
    const episodeService: EpisodeService = new EpisodeService(persistanceService)
    const characterResolver: CharacterResolver = new CharacterResolver(locationService, characterService, episodeService)
    const locationResolver: LocationResolver = new LocationResolver(locationService, characterService);
    const episodeResolver: EpisodeResolver = new EpisodeResolver(episodeService, characterService)
    const resolverService: ResolverService = new ResolverService(locationResolver, characterResolver, episodeResolver);

    return {
        characterService,
        environService,
        episodeService,
        locationResolver,
        locationService,
        persistanceService,
        resolverService
    }
}

const initPersistanceService = (environService: EnvironmentService, loggerService: LoggerService) => {
    const persistanceService = new PersistanceService(environService, loggerService);
    persistanceService.models = mockDatabaseModels
    return persistanceService
}
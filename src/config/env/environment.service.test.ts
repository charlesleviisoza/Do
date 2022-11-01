import 'reflect-metadata';
import { EnvironmentService } from "./environment.service";

describe('Environment variables', ()=>{

    const realEnvs = process.env;

    beforeEach(()=>{
        jest.resetModules();
        process.env = realEnvs;
    })

    test('Valid environment variables', ()=>{
        process.env = {
            ...process.env,
            DATABASE_HOST: "test",
            DATABASE_NAME: "test",
            DATABASE_PASSWORD: "test",
            DATABASE_PORT: "test",
            DATABASE_SSL: "TRUE",
            DATABASE_USER: "test",
            HOSTNAME: "test",
            LOGGER_LEVEL: 'OFF',
            MIGRATE_DATABASE: "FALSE",
            NODE_ENV: "development",
            PORT: "3000",
            ROOT_PATH: "/api"
        }
        const environService = new EnvironmentService();
        expect(environService.getValidationError()).toBeFalsy();
    })

    test('Invalid environment variables', ()=>{
        const environService = new EnvironmentService();
        expect(environService.getValidationError()).toBeTruthy();
    })
})
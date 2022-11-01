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
            DATABASE_USER: "test",
            PORT: "3000",
            ROOT_PATH: "/api",
            NODE_ENV: "development",
            LOGGER_LEVEL: 'OFF'
        }
        const environService = new EnvironmentService();
        expect(environService.getValidationError()).toBeFalsy();
    })

    test('Invalid environment variables', ()=>{
        const environService = new EnvironmentService();
        expect(environService.getValidationError()).toBeTruthy();
    })
})
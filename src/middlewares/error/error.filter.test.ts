import 'reflect-metadata';
import { EnvironmentService } from "@config/env/environment.service";
import { ApiErrors } from "@enums/errors.enum";
import { InternalServerError } from "@errors/internalServer.error";
import { RequestSchemaError } from "@errors/requestScheme.error"
import { LoggerService } from "@services/logger/logger.service";
import { createRequest, createResponse } from "node-mocks-http";
import { errorFilter } from "./error.filter";
import { ForbiddenError } from '@errors/forbidden.error';
import { SAMPLE_ENVIRONMENT } from '@utils/environment.sample';

describe('Error filter tests', ()=>{

    const environService: EnvironmentService = new EnvironmentService();
    environService.getVariables = jest.fn(()=>SAMPLE_ENVIRONMENT);
    const loggerService: LoggerService = new LoggerService(environService);

    test('RequestSchemeError', ()=>{
        const error = new RequestSchemaError('Error');
        const request = createRequest({
            method: 'POST',
            url: '/auth/login'
        });
        const response = createResponse();
        const result = errorFilter(loggerService)(error, request, response, ()=>{});
        expect(result?.statusCode).toEqual(400);
        expect(error.getResponse().error).toEqual(ApiErrors.REQUEST_SCHEMA_ERROR);
    })

    test('InternalServerError', ()=>{
        const error = new InternalServerError('Error');
        const request = createRequest({
            method: 'POST',
            url: '/auth/login'
        });
        const response = createResponse();
        const result = errorFilter(loggerService)(error, request, response, ()=>{});
        expect(result?.statusCode).toEqual(500);
        expect(error.getResponse().error).toEqual(ApiErrors.INTERNAL_SERVER_ERROR);
    })

    test('ForbiddenError', ()=>{
        const error = new ForbiddenError('Error');
        const request = createRequest({
            method: 'POST',
            url: '/auth/login'
        });
        const response = createResponse();
        const result = errorFilter(loggerService)(error, request, response, ()=>{});
        expect(result?.statusCode).toEqual(403);
        expect(error.getResponse().error).toEqual(ApiErrors.FORBIDDEN);
    })

})
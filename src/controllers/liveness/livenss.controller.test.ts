import 'reflect-metadata';
import { createRequest, createResponse } from "node-mocks-http";
import { getSampleServices, ISampleServices } from '@utils/environment.sample';
import { LivenessController } from './liveness.controller';

describe('Auth Controller', ()=>{
    let livenessController: LivenessController;
    let services: ISampleServices;

    beforeEach(()=>{
        services = getSampleServices();
        livenessController = new LivenessController();
    })

    test('Index', async () => {
        const request = createRequest({
            method: 'GET',
            url: '/'
        });
        const response = createResponse();
        const result = await livenessController.index(request, response, ()=>({}));
        expect(result.data).toEqual('App is live');
    })

})
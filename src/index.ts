import "reflect-metadata";
import 'module-alias/register';
import 'dotenv/config';
import * as bodyParser from 'body-parser';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { errorFilter } from "@middlewares/error/error.filter";
import helmet from "helmet";
import { graphqlHTTP } from "express-graphql";
import { IEnvironmentService } from "@config/env";
import { ILoggerService } from "@services/logger";
import { IResolverService } from "@services/resolver";
import { ApiErrors } from "@enums/errors.enum";
import { IPersistanceService } from "@services/persistance";
import depthLimit from "graphql-depth-limit";
import { IEnvironmentVariables } from "@config/env/environmentVariables";
import { ApiError } from "@errors/api.error";
import { InternalServerError } from "@errors/internalServer.error";

// Get environment
const environmentService: IEnvironmentService = container.get(TYPE.IEnvironmentService);
const validationError = environmentService.getValidationError()
if (validationError){
  throw new Error(validationError.message);
}

// Get logger
const loggerService: ILoggerService = container.get(TYPE.ILoggerService)

// Get resolver service - GraphQL
const resolverService: IResolverService = container.get(TYPE.IResolverService)

// Get persistance service
const persistanceService: IPersistanceService = container.get(TYPE.IPersistanceService)


const envVariables = environmentService.getVariables()

// Graphql Validators

const getGraphqlValidators = (env: IEnvironmentVariables) => {
  const validators = []
  if(env.depthLimit){
    validators.push(depthLimit(Number(env.depthLimit)))
  }
  return validators
}

// create server
const server = new InversifyExpressServer(container, null, {
  rootPath: envVariables.rootPath
});

server.setErrorConfig((app) => {
  app.use(errorFilter(loggerService));
});

server.setConfig((app) => {
  // add body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  // add morgan logger middleware
  app.use(loggerService.getMorganMiddleware());
  // add helmet middlewares
  app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }));

  // add graphql server
  app.use(
    `${envVariables.rootPath}/graphql`,
    graphqlHTTP({
      customFormatErrorFn: (err)=>{
        const error: any = err.originalError || err
        if (error) {
          if(error instanceof ApiError){
            error.log(loggerService);
          }else{
            const genericError = new InternalServerError(error.message);
            genericError.log(loggerService);
          }
      }
        return {
          errorId: error?.errorId || ApiErrors.INTERNAL_SERVER_ERROR,
          message: err.message
        }
      },
      graphiql: envVariables.graphqlUi,
      schema: resolverService.getExecutableSchema(),
      validationRules: getGraphqlValidators(envVariables)
    }),
  );

});

const serverApp = server.build();
const port = environmentService.getVariables().port;

persistanceService.initConnection().then(()=>{
  serverApp.listen(port, ()=>{
    loggerService.info(`HTTP Server listening in port ${port}`);
  });
})

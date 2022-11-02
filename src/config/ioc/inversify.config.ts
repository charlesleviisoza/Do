import { Container } from 'inversify';
import { buildProviderModule, provide } from 'inversify-binding-decorators'

// set up container
const container = new Container();

// import controllers
import '@controllers/liveness/liveness.controller'

// import resolvers
import '@resolvers/location/location.resolver'
import '@resolvers/character/character.resolver'
import '@resolvers/episode/episode.resolver'

// import services
import '@config/env/environment.service'
import '@services/logger/logger.service'
import '@services/persistance/persistance.service'
import '@services/resolver/resolver.service'
import '@services/location/location.service'
import '@services/character/character.service'
import '@services/episode/episode.service'


container.load(buildProviderModule());

export { container, provide };
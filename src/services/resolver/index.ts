import { GraphQLSchema } from 'graphql'

export interface IResolverService {
    getExecutableSchema(): GraphQLSchema
}
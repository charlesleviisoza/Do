import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { inject } from "inversify";
import { IResolverService } from ".";
import { IResolvers } from "@graphql-tools/utils"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { GraphQLSchema } from 'graphql'
import { IAPIResolver } from "@resolvers/index";

@provide(TYPE.IResolverService)
export class ResolverService implements IResolverService{

    private typeDefs: string
    private resolvers: IResolvers<any>

    constructor(
        @inject(TYPE.LocationResolver) private locationResolver: IAPIResolver,
        @inject(TYPE.CharacterResolver) private characterResolver: IAPIResolver,
        @inject(TYPE.EpisodeResolver) private episodeResolver: IAPIResolver
    ){
        const resolvers = [
            this.locationResolver,
            this.characterResolver,
            this.episodeResolver
        ]
        this.typeDefs = `
            ${this.initTypeDefs(resolvers)}

            """
            Status of the result
            """
            type Status {
                """
                1: Success - 0: Error
                """
                status: Int!
            }

            """
            Information of the result
            """
            type Info {
                """
                Total number of records
                """
                count: Int
                """
                Total number of pages (if using pagination)
                """
                pages: Int
                """
                Next page number (if using pagination)
                """
                next: Int
                """
                Previous page number (if using pagination)
                """
                prev: Int
            }

            """
            Pagination input
            """
            input Pagination {
                """
                Number of records per page
                """
                limit: Int!
                """
                Page number
                """
                page: Int!
            }
        `
        this.resolvers = this.initResolvers(resolvers)
    }

    initTypeDefs(resolvers: IAPIResolver[]){
        let result = ''
        resolvers.forEach(resolver=>{
            result = `
                ${result}
                ${resolver.getTypeDef()}
            `
        })
        return result
    }

    initResolvers(resolvers: IAPIResolver[]){
        let result = {
            Mutation: {},
            Query: {}
        }
        resolvers.forEach(resolver=>{
            const { Mutation, Query, ...otherResolvers } = resolver.getResolvers()
            result.Mutation = Object.assign(result.Mutation, Mutation)
            result.Query = Object.assign(result.Query, Query)
            result = Object.assign(result, otherResolvers)
        })
        return result
    }

    getExecutableSchema(): GraphQLSchema {
        return makeExecutableSchema({
            resolvers: this.resolvers,
            typeDefs: this.typeDefs
        })
    }

}
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
        @inject(TYPE.CharacterResolver) private characterResolver: IAPIResolver
    ){
        const resolvers = [
            this.locationResolver,
            this.characterResolver
        ]
        this.typeDefs = `
            ${this.initTypeDefs(resolvers)}

            type Status {
                status: Int!
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
        const result = {
            Mutation: {},
            Query: {}
        }
        resolvers.forEach(resolver=>{
            const mutations = resolver.getMutationResolvers()
            const queries = resolver.getQueryResolvers()
            result.Mutation = Object.assign(result.Mutation, mutations)
            result.Query = Object.assign(result.Query, queries)
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
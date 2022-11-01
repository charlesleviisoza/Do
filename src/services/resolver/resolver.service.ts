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
        @inject(TYPE.LocationResolver) private locationResolver: IAPIResolver
    ){
        this.typeDefs = `
            ${this.locationResolver.getTypeDef()}

            type Status {
                status: Int!
            }
        `
        this.resolvers = {
            Mutation: {
                ...this.locationResolver.getMutationResolvers()
            },
            Query: {
                ...this.locationResolver.getQueryResolvers()
            }
        }
    }

    getExecutableSchema(): GraphQLSchema {
        return makeExecutableSchema({
            resolvers: this.resolvers,
            typeDefs: this.typeDefs
        })
    }

}
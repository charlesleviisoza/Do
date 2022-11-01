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
        @inject(TYPE.AttachmentResolver) private attachmentResolver: IAPIResolver
    ){
        this.typeDefs = `
            ${this.attachmentResolver.getTypeDef()}

            type Status {
                status: Int!
            }
        `
        this.resolvers = {
            Query: {
                ...this.attachmentResolver.getQueryResolvers()
            },
            Mutation: {
                ...this.attachmentResolver.getMutationResolvers()
            }
        }
    }

    getExecutableSchema(): GraphQLSchema {
        return makeExecutableSchema({
            typeDefs: this.typeDefs,
            resolvers: this.resolvers
        })
    }

}
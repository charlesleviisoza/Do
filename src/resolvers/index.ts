export interface IAPIResolver{
    getTypeDef(): string
    getQueryResolvers(): any
    getMutationResolvers(): any
    getResolvers(): any
}
import { IEnvironmentVariables } from "./environmentVariables"

export interface IEnvironmentService{
    loadEnvironment(): void
    getVariables(): IEnvironmentVariables
    getValidationError(): Error | undefined
}
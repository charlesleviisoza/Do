import { EnvironmentVariables } from "./environmentVariables"

export interface IEnvironmentService{
    loadEnvironment(): void
    getVariables(): EnvironmentVariables
    getValidationError(): Error | undefined
}
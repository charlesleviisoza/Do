export interface ILoggerService {
    debug(message: any): void
    info(message: any): void
    error(message: any): void
    getMorganMiddleware(): any
    initLogger(): void
}
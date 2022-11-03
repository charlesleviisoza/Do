export interface IInfoResponse<T>{
    info: {
        count: number
        pages?: number
        next?: number | null
        prev?: number | null
    },
    result: T[]
}

export interface IPagination {
    page: number
    limit: number
}
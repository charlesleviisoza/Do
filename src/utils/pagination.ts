export const getPaginationInfo = (page: number, limit: number, count: number) => {
    const pages = Math.ceil(count / limit)
    const next = page + 1 <= pages ? page + 1 : null
    const prev = page - 1 > 0 ? page - 1 : null
    return {
        next,
        pages,
        prev
    }
}
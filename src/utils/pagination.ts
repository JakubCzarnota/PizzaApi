declare global {
    interface IPaginationOptions {
        page?: number,
        count?: number
    }
}

const paginate = (values: any[], paginationOptions: IPaginationOptions) => {
    const page = paginationOptions.page || 0
    const count = paginationOptions.count

    const startingId = (count != null && page!=0) ? count * (page - 1) : 0

    if (startingId >= values.length)
        return []

    return count != null ? values.slice(startingId).slice(0, count) : values.slice(startingId)

}

export default paginate
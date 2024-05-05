class NotFoundError extends Error {
    statusCode: number
    error: string

    constructor(message: string, error : string) {
        super(message)
        this.statusCode = 404;
        this.error = error;
    }
}

export default NotFoundError
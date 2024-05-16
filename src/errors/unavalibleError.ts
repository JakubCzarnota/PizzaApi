class UnavalibleError extends Error {
    statusCode: number
    error: string

    constructor(message: string, error : string) {
        super(message)
        this.statusCode = 400;
        this.error = error;
    }
}

export default UnavalibleError
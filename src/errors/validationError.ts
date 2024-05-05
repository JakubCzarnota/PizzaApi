class ValidationError extends Error {
    statusCode: number
    errors: {}

    constructor(message: string, statusCode: number, errors: {}) {
        super(message)
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

export default ValidationError;
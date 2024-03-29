export default class DatabaseException extends Error {
    constructor(error, cause) {
        super(error.toString());
        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;
        this.errorDetails = {};

        this.cause = cause;
        this.errorDetails.message = error;
    }

    getStatus() {
        if (this.errorDetails.message) {
            return this.errorDetails.message;
        }
        return -1;
    }
}

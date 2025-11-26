export class NotFoundError extends Error {
    public statusCode: number;
    constructor(message = "Recurso no encontrado") {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}


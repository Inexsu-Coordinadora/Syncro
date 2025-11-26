export class ValidationError extends Error {
    constructor(message = "Validación fallida") {
        super(message);
        this.name = "ValidationError";
    }
}

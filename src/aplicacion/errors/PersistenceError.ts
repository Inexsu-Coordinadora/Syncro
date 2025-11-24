export class PersistenceError extends Error {
    constructor(message = "Error de persistencia") {
        super(message);
        this.name = "PersistenceError";
    }
}

import { FastifyReply } from "fastify";
import { NotFoundError } from "../../aplicacion/errors/NotFoundError";
import { ValidationError } from "../../aplicacion/errors/ValidationError";
import { PersistenceError } from "../../aplicacion/errors/PersistenceError";

export function mapearError(res: FastifyReply, error: unknown) {
    if (error instanceof ValidationError) {
        return res.status(422).send({ mensaje: error.message });
    }
    if (error instanceof NotFoundError) {
        return res.status(404).send({ mensaje: error.message });
    }
    if (error instanceof PersistenceError) {
        return res.status(500).send({ mensaje: error.message });
    }
    return res.status(400).send({ mensaje: "Error inesperado" });
}

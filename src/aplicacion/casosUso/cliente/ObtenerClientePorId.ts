import { ICliente } from "../../dominio/entidades/ICliente";
import { IRepositorioCliente } from "../../dominio/repositorio/IRepositorioCliente";
import { NotFoundError } from "../errors/NotFoundError";

export class ObtenerClientePorId {
    private repositorioCliente: IRepositorioCliente;

    constructor(repositorioCliente: IRepositorioCliente) {
        this.repositorioCliente = repositorioCliente;
    }

    // Devuelve ICliente y lanza NotFoundError si no existe
    async ejecutar(id: string): Promise<ICliente> {
        if (!id) {
            throw new Error("El ID del cliente es obligatorio.");
        }

        const cliente = await this.repositorioCliente.obtenerClientePorId(id);
        if (!cliente) {
            throw new NotFoundError(`Cliente con ID ${id} no encontrado.`);
        }

        return cliente;
    }
}

import { IRepositorioCliente } from "../../dominio/repositorio/IRepositorioCliente";
import { NotFoundError } from "../errors/NotFoundError";

export class EliminarCliente {
    private repositorioCliente: IRepositorioCliente;

    constructor(repositorioCliente: IRepositorioCliente) {
        this.repositorioCliente = repositorioCliente;
    }

    async ejecutar(idCliente: string): Promise<string> {
        if (!idCliente) {
            throw new Error("El ID del cliente es obligatorio para la eliminación.");
        }

        // Comprobar existencia para poder devolver un error de dominio 
        const existente = await this.repositorioCliente.obtenerClientePorId(idCliente);
        if (!existente) {
            throw new NotFoundError(`Cliente con ID ${idCliente} no encontrado.`);
        }

        
        return await this.repositorioCliente.eliminarCliente(idCliente);
    }
}

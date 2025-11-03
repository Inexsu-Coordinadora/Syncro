import { ICliente } from "../../dominio/entidades/ICliente";
import { IRepositorioCliente } from "../../dominio/repositorio/IRepositorioCliente";
import { NotFoundError } from "../errors/NotFoundError";

export class ActualizarCliente {
    private repositorioCliente: IRepositorioCliente;

    constructor(repositorioCliente: IRepositorioCliente) {
        this.repositorioCliente = repositorioCliente;
    }

    // Mantener la promesa que resuelve a ICliente (no propagar nulls)
    async ejecutar(idCliente: string, datosCliente: ICliente): Promise<ICliente> {
        if (!idCliente) {
            throw new Error("El ID del cliente es obligatorio para la actualización.");
        }

        // Validaciones mínimas (puedes extraer a un validador separado)
        if (!datosCliente.nombreCliente || !datosCliente.direccionCliente || !datosCliente.emailCliente) {
            throw new Error("Los campos nombreCliente, direccionCliente y emailCliente son obligatorios.");
        }

        const actualizado = await this.repositorioCliente.actualizarCliente(idCliente, datosCliente);

        if (!actualizado) {
            //convertir resultado del repo en una excepción de dominio
            throw new NotFoundError(`Cliente con ID ${idCliente} no encontrado.`);
        }

        return actualizado;
    }
}
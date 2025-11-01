import { ICliente } from "../../dominio/entidades/ICliente";
import { IRepositorioCliente } from "../../dominio/repositorio/IRepositorioCliente";

export class ObtenerClientePorId {
    private repositorioCliente: IRepositorioCliente;

    constructor(repositorioCliente: IRepositorioCliente) {
        this.repositorioCliente = repositorioCliente;
    }
    async ejecutar(id: string): Promise<ICliente | null> {
        if (!id) {
            throw new Error("El ID del cliente es obligatorio.");
        }
        return await this.repositorioCliente.obtenerClientePorId(id);
    }
}

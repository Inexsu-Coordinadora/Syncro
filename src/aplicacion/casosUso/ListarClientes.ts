import { ICliente } from "../../dominio/entidades/ICliente";
import { IRepositorioCliente } from "../../dominio/repositorio/IRepositorioCliente";

export class listarClientes {
    private repositorioCliente: IRepositorioCliente;

    constructor(repositorioCliente: IRepositorioCliente) {
        this.repositorioCliente = repositorioCliente;
    }

    async ejecutar(): Promise<ICliente[]> {
        return await this.repositorioCliente.obtenerCliente();
    }
}
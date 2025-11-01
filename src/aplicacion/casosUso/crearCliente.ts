import { ICliente } from "../../dominio/entidades/ICliente";
import { IRepositorioCliente } from "../../dominio/repositorio/IRepositorioCliente";

export class crearCliente {
    private repositorioCliente: IRepositorioCliente;

    constructor(repositorioCliente: IRepositorioCliente) {
        this.repositorioCliente = repositorioCliente;
    }
    async ejecutar(datosCliente: ICliente): Promise<ICliente> {
        if (!datosCliente.nombreCliente || !datosCliente.emailCliente) {
            throw new Error("El nombre y el correo son obligatorios.");
        }
        return await this.repositorioCliente.crearCliente(datosCliente);
    }
}
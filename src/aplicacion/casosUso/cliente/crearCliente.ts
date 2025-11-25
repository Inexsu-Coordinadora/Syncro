import { ICliente } from "../../../dominio/entidades/ICliente";
import { IRepositorioCliente } from "../../../dominio/repositorio/IRepositorioCliente";

export class CrearCliente {
    private repositorioCliente: IRepositorioCliente;

    constructor(repositorioCliente: IRepositorioCliente) {
        this.repositorioCliente = repositorioCliente;
    }
    async ejecutar(datosCliente: ICliente): Promise<ICliente> {
        if (!datosCliente.nombre_cliente || !datosCliente.email_cliente) {
            throw new Error("El nombre y el correo son obligatorios.");
        }
        return await this.repositorioCliente.crearCliente(datosCliente);
    }
}
import { ICliente } from "../entidades/ICliente";

export interface IRepositorioCliente {
    listarClientes(): Promise<ICliente[]>;
    obtenerClientePorId(id: string): Promise<ICliente | null>;
    crearCliente(cliente: ICliente): Promise<ICliente>;
    actualizarCliente(id: string, cliente: ICliente): Promise<ICliente | null>;
    eliminarCliente(id: string): Promise<string>;
}

import { ICliente } from "../entidades/ICliente";

export interface IRepositorioCliente {
    crearCliente(datosCliente: ICliente): Promise<ICliente>;
    obtenerCliente(): Promise<ICliente[]>;
    obtenerClientePorId(id: string): Promise<ICliente | null>;
    actualizarCliente(id: string,
        datosCliente: ICliente
    ): Promise<ICliente | null>;
    eliminarCliente(id: string): Promise<string>;
}
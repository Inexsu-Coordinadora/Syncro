import { ICliente } from "../entidades/ICliente";
import { ProyectoResumen } from '../../interfaces/rutas/proyectoResumen'; 

export interface IRepositorioCliente {
    crearCliente(datosCliente: ICliente): Promise<ICliente>;
    obtenerCliente(): Promise<ICliente[]>;
    obtenerClientePorId(id: string): Promise<ICliente | null>;
    actualizarCliente(id: string,
        datosCliente: ICliente
    ): Promise<ICliente | null>;
    eliminarCliente(id: string): Promise<string>;

    consultarProyectosPorCliente(clienteId: string): Promise<ProyectoResumen[]>;
}

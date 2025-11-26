import { ICliente } from "../entidades/ICliente";
<<<<<<< HEAD

export interface IRepositorioCliente {
    listarClientes(): Promise<ICliente[]>;
    obtenerClientePorId(id: string): Promise<ICliente | null>;
    crearCliente(cliente: ICliente): Promise<ICliente>;
    actualizarCliente(id: string, cliente: ICliente): Promise<ICliente | null>;
    eliminarCliente(id: string): Promise<string>;
=======
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
>>>>>>> b30b58e262039a921993cc4e13d2a9ce26e55470
}

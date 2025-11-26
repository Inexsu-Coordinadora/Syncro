import { IProyecto } from "../entidades/IProyecto";

export interface IRepositorioProyecto {
    listarProyectos(): Promise<IProyecto[]>;

    obtenerProyectoPorId(id: string): Promise<IProyecto | null>;
    actualizarProyecto(id: string,
        datosProyecto: IProyecto
    ): Promise<IProyecto | null>;
    eliminarProyecto(id: string): Promise<string>;
    
}

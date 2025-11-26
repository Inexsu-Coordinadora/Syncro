import { IProyecto } from "../entidades/IProyecto";

export interface IRepositorioProyecto {
    crearProyecto(datosProyecto: IProyecto): Promise<IProyecto>;
    listarProyectos(): Promise<IProyecto[]>;
    obtenerProyectoPorId(id: string): Promise<IProyecto | null>;
    actualizarProyecto(id: string,
        datosProyecto: IProyecto
    ): Promise<IProyecto | null>;
    eliminarProyecto(id: string): Promise<string>;
    
}

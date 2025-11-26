import { ITarea } from "../entidades/ITarea";

export interface IRepositorioTarea {
    listarTareas(): Promise<ITarea[]>;
    obtenerTareaPorId(id: string): Promise<ITarea | null>;
    crearTarea(tarea: ITarea): Promise<ITarea>;
    actualizarTarea(id: string, tarea: ITarea): Promise<ITarea | null>;
    eliminarTarea(id: string): Promise<string>;
}

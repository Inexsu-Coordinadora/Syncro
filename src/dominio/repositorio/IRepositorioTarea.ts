import { ITarea } from '../entidades/ITarea';

export interface IRepositorioTarea {
    crear(tarea: ITarea): Promise<ITarea>;
    listar(): Promise<ITarea[]>;
    obtenerPorId(id: number): Promise<ITarea | null>;
    actualizar(id: number, tarea: ITarea): Promise<ITarea | null>;
    eliminar(id: number): Promise<boolean>;
    actualizarEstado(idTarea: string, nuevoEstado: string): Promise<ITarea | null>;
    listarPorProyecto(idProyecto: string): Promise<ITarea[]>;
}

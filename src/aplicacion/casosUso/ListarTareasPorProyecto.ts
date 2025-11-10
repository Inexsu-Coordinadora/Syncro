import { ITarea } from "../../dominio/entidades/ITarea";
import { IRepositorioTarea } from "../../dominio/repositorio/IRepositorioTarea";

export class ListarTareasPorProyecto {
    constructor(private repo: IRepositorioTarea) { }

    async ejecutar(idProyecto: string): Promise<ITarea[]> {
        try {
            return await this.repo.listarPorProyecto(idProyecto);
        } catch (error) {
            console.error(`Error al listar tareas del proyecto ${idProyecto}:`, error);
            throw new Error(`No se pudieron obtener las tareas del proyecto ${idProyecto}`);
        }
    }
}

import { ITarea } from "../../../dominio/entidades/ITarea";
import { IRepositorioTarea } from "../../../dominio/repositorio/IRepositorioTarea";

export class ActualizarTarea {
    constructor(private repo: IRepositorioTarea) { }

    async ejecutar(id: string, tarea: ITarea): Promise<ITarea | null> {
        if (!id) throw new Error("El ID es obligatorio.");
        return await this.repo.actualizarTarea(id, tarea);
    }
}

    
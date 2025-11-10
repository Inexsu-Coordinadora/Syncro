import { ITarea } from "../../dominio/entidades/ITarea";
import { IRepositorioTarea } from "../../dominio/repositorio/IRepositorioTarea";

export class CrearTarea {
    constructor(private repo: IRepositorioTarea) { }

    async ejecutar(tarea: ITarea) {
        return await this.repo.crear(tarea);
    }
}

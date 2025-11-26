import { ITarea } from "../../../dominio/entidades/ITarea";
import { IRepositorioTarea } from "../../../dominio/repositorio/IRepositorioTarea";

export class CrearTarea {
    constructor(private tareaRepo: IRepositorioTarea) { }

    ejecutar(tarea: ITarea) {
        return this.tareaRepo.crearTarea(tarea);
    }
}

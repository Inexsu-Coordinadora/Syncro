import { ITarea } from "../../../dominio/entidades/ITarea";
import { IRepositorioTarea } from "../../../dominio/repositorio/IRepositorioTarea";

export class ListarTareas {
    constructor(private repo: IRepositorioTarea) { }

    async ejecutar(): Promise<ITarea[]> {
        return await this.repo.listarTareas();
    }
}

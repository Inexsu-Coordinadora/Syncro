import { IRepositorioTarea } from "../../../dominio/repositorio/IRepositorioTarea";

export class EliminarTarea {
    constructor(private repo: IRepositorioTarea) { }

    async ejecutar(id: string): Promise<string> {
        if (!id) throw new Error("El ID es obligatorio.");
        return await this.repo.eliminarTarea(id);
    }
}

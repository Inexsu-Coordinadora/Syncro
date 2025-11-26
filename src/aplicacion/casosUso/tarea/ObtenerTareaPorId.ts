import { ITarea } from "../../../dominio/entidades/ITarea";
import { IRepositorioTarea } from "../../../dominio/repositorio/IRepositorioTarea";

export class ObtenerTareaPorId {
    constructor(private repo: IRepositorioTarea) { }

    async ejecutar(id: string): Promise<ITarea | null> {
        if (!id) throw new Error("El ID es obligatorio.");

        return await this.repo.obtenerTareaPorId(id);
    }
}

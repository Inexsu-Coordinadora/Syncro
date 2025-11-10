import { IRepositorioTarea } from "../../dominio/repositorio/IRepositorioTarea";

export class CambiarEstadoTarea {
    constructor(private repo: IRepositorioTarea) { }

    async ejecutar(idTarea: string, nuevoEstado: string) {
        const tarea = await this.repo.actualizarEstado(idTarea, nuevoEstado);
        if (!tarea) throw new Error("La tarea ya estaba completada o no existe.");
        return tarea;
    }
}

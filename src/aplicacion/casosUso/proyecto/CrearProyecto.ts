import { IRepositorioProyecto } from "../../../dominio/repositorio/IRepositorioProyecto";
import { IProyecto } from "../../../dominio/entidades/IProyecto";

export class CrearProyecto {
    constructor(private repo: IRepositorioProyecto) {}

    async ejecutar(datos: IProyecto) {
        return await this.repo.crearProyecto(datos);
    }
}

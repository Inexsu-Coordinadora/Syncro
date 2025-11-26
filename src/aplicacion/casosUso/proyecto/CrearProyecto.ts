
import { IProyecto } from '../../../dominio/entidades/IProyecto';
import { IRepositorioProyecto } from '../../../dominio/repositorio/IRepositorioProyecto';


// Caso de uso para crear un nuevo proyecto
export class CrearProyecto {
    constructor(private repo: IRepositorioProyecto) {}

    async ejecutar(datos: IProyecto) {
        return await this.repo.crearProyecto(datos);
    }
}

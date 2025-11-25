import { IProyecto } from '../../../../dominio/entidades/IProyecto';
import { IRepositorioProyecto } from '../../../../dominio/repositorio/IRepositorioProyecto';
import { NotFoundError } from '../../../errors/NotFoundError'; 

// Caso de uso para actualizar un proyecto existente
export class ActualizarProyecto {
  constructor(private readonly repo: IRepositorioProyecto) {}
async ejecutar(id: string, datos: Partial<IProyecto>): Promise<IProyecto> {
    const proyectoActualizado = await this.repo.actualizarProyecto(id, datos as IProyecto);
    if (!proyectoActualizado) {
        throw new NotFoundError(`Proyecto con ID ${id} no encontrado para actualizar.`);
    }
    return proyectoActualizado;
}
}
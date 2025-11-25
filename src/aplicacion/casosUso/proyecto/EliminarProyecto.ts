import { IRepositorioProyecto } from '../../../dominio/repositorio/IRepositorioProyecto';
import { NotFoundError } from '../../errors/NotFoundError';

// Caso de uso para eliminar un proyecto por su ID
export class EliminarProyecto {
  constructor(private readonly repo: IRepositorioProyecto) {}
async ejecutar(id: string): Promise<string> {
    const proyectoEliminado = await this.repo.eliminarProyecto(id);
    if (!proyectoEliminado) {
        throw new NotFoundError(`Proyecto con ID ${id} no encontrado para eliminar.`);
    }
    return `Proyecto ${id} eliminado con éxito.`;
}
}
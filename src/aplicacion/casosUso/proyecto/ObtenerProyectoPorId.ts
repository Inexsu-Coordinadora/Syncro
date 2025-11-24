import { IProyecto } from '../../../dominio/entidades/proyecto/IProyecto';
import { IRepositorioProyecto } from '../../../dominio/repositorio/proyecto/IRepositorioProyecto';
import { NotFoundError } from '../../errors/NotFoundError';

//  Caso de uso para obtener un proyecto por su ID
export class ObtenerProyectoPorId {
  constructor(private readonly repo: IRepositorioProyecto) {}
async ejecutar(id: string): Promise<IProyecto> {
    const proyecto = await this.repo.obtenerProyectoPorId(id);
    if (!proyecto) {
        throw new NotFoundError(`Proyecto con ID ${id} no encontrado.`);
    }
    return proyecto;
}
}
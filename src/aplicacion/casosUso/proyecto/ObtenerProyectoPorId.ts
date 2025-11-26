import { IRepositorioProyecto } from '../../../dominio/repositorio/IRepositorioProyecto';
import { NotFoundError } from '../../errors/NotFoundError';

//  Caso de uso para obtener un proyecto por su ID
export class ObtenerProyectoPorId {
  constructor(private repo: IRepositorioProyecto) {}

  async ejecutar(id: string) {
    const proyecto = await this.repo.obtenerProyectoPorId(id);
    if (!proyecto) {
      throw new NotFoundError("Proyecto no encontrado");
    }
    return proyecto;
  }
}

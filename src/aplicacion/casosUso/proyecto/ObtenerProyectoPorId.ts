import { IProyecto } from '../../../dominio/entidades/IProyecto';
import { IRepositorioProyecto } from '../../../dominio/repositorio/IRepositorioProyecto';

//  Caso de uso para obtener un proyecto por su ID
export class ObtenerProyectoPorId {
  constructor(private readonly repo: IRepositorioProyecto) {}
  async ejecutar(id: string): Promise<IProyecto | null> {
    return this.repo.obtenerProyectoPorId(id);
  }
}
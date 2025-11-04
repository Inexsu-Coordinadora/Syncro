import { IProyecto } from '../../dominio/entidades/IProyecto';
import { IRepositorioProyecto } from '../../dominio/repositorio/IRepositorioProyecto';

export class ObtenerProyectoPorId {
  constructor(private readonly repo: IRepositorioProyecto) {}
  async ejecutar(id: string): Promise<IProyecto | null> {
    return this.repo.obtenerProyectoPorId(id);
  }
}
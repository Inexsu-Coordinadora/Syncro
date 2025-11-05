import { IRepositorioProyecto } from '../../dominio/repositorio/IRepositorioProyecto';

export class EliminarProyecto {
  constructor(private readonly repo: IRepositorioProyecto) {}
  async ejecutar(id: string): Promise<string> {
    return this.repo.eliminarProyecto(id);
  }
}
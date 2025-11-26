import { IRepositorioProyecto } from '../../../dominio/repositorio/IRepositorioProyecto';

// Caso de uso para eliminar un proyecto por su ID
export class EliminarProyecto {
  constructor(private readonly repo: IRepositorioProyecto) {}
  async ejecutar(id: string): Promise<boolean> {
    return this.repo.eliminarProyecto(id);
  }
}
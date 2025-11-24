import { IProyecto } from '../../../dominio/entidades/proyecto/IProyecto';
import { IRepositorioProyecto } from '../../../dominio/repositorio/proyecto/IRepositorioProyecto';

// Caso de uso para listar todos los proyectos
export class ListarProyectos {
  constructor(private readonly repo: IRepositorioProyecto) {}
  async ejecutar(): Promise<IProyecto[]> {
    return this.repo.listarProyectos();
  }
}
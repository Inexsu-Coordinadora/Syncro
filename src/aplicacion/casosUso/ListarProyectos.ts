import { IProyecto } from '../../dominio/entidades/IProyecto';
import { IRepositorioProyecto } from '../../dominio/repositorio/IRepositorioProyecto';

export class ListarProyectos {
  constructor(private readonly repo: IRepositorioProyecto) {}
  async ejecutar(): Promise<IProyecto[]> {
    return this.repo.listarProyectos();
  }
}
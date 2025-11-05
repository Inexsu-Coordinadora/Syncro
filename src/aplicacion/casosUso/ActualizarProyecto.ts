import { IProyecto } from '../../dominio/entidades/IProyecto';
import { IRepositorioProyecto } from '../../dominio/repositorio/IRepositorioProyecto';

// Caso de uso para actualizar un proyecto existente
export class ActualizarProyecto {
  constructor(private readonly repo: IRepositorioProyecto) {}
  async ejecutar(id: string, datos: IProyecto): Promise<IProyecto | null> {
    return this.repo.actualizarProyecto(id, datos);
  }
}
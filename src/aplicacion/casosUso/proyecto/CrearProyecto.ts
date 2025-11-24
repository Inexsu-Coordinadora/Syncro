import { IProyecto } from '../../../dominio/entidades/proyecto/IProyecto';
import { IRepositorioProyecto } from '../../../dominio/repositorio/proyecto/IRepositorioProyecto';

// Caso de uso para crear un nuevo proyecto
export class CrearProyecto {
  constructor(private readonly repo: IRepositorioProyecto) {}

  async ejecutar(datos: IProyecto): Promise<IProyecto> {
    if (datos.estadoProyecto !== 'Planificado') {
      throw new Error('El estado inicial debe ser Planificado.');
    }
    return this.repo.crearProyecto(datos);
  }
}

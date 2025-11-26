import { IConsultor } from "../../../dominio/entidades/IConsultor"; 
import { IRepositorioConsultor } from "../../../dominio/repositorio/IRepositorioConsultor"; 

export class ActualizarConsultor {
  constructor(private repo: IRepositorioConsultor) {}

  async ejecutar(idConsultor: string, data: Partial<IConsultor>): Promise<IConsultor | null> {
    
    const consultorExistente = await this.repo.obtenerPorId(idConsultor);
    if (!consultorExistente) return null;

    const consultorActualizado: IConsultor = {
      ...consultorExistente,
      ...data,
      idConsultor,
    };
    return await this.repo.actualizar(idConsultor, consultorActualizado);
  }
}

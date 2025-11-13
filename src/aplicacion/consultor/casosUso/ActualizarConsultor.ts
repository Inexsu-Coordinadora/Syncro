import { IConsultor } from "../../../dominio/consultor/entidades/IConsultor"; 
import { IRepositorioConsultor } from "../../../dominio/consultor/repositorio/IRepositorioConsultor"; 

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

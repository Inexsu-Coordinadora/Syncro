import { IConsultor } from "../../../dominio/consultor/entidades/IConsultor"; 
import { IRepositorioConsultor } from "../../../dominio/consultor/repositorio/IRepositorioConsultor"; 

export class ObtenerConsultorPorId {
  constructor(private repo: IRepositorioConsultor) {}

  async ejecutar(idConsultor: string): Promise<IConsultor | null> {
    return await this.repo.obtenerPorId(idConsultor);
  }
}

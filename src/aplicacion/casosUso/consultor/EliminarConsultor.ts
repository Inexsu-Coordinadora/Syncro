import { IRepositorioConsultor } from "../../../dominio/repositorio/IRepositorioConsultor"; 

export class EliminarConsultor {
  constructor(private repo: IRepositorioConsultor) {}

  async ejecutar(idConsultor: string): Promise<boolean> {
    
    const consultorExistente = await this.repo.obtenerPorId(idConsultor);
    if (!consultorExistente) return false;

    await this.repo.eliminar(idConsultor);
    return true;
  }
}


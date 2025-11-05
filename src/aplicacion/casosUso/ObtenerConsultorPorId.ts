import { IConsultor } from "../../dominio/entidades/IConsultor.js";
import { IRepositorioConsultor } from "../../dominio/repositorio/IRepositorioConsultor.js";

export class ObtenerConsultorPorId {
  constructor(private repo: IRepositorioConsultor) {}

  async ejecutar(idConsultor: string): Promise<IConsultor | null> {
    return await this.repo.obtenerPorId(idConsultor);
  }
}

import { IRepositorioConsultor } from "../../../dominio/repositorio/IRepositorioConsultor";

export class EliminarConsultor {
  constructor(private repo: IRepositorioConsultor) {}

  async ejecutar(idConsultor: string): Promise<boolean> {
    return await this.repo.eliminar(idConsultor);
  }
}
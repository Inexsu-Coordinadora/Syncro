import { IConsultor } from "../../dominio/entidades/IConsultor.js";
import { IRepositorioConsultor } from "../../dominio/repositorio/IRepositorioConsultor.js";

export class LeerConsultores {
  constructor(private repo: IRepositorioConsultor) {}

  async ejecutar(): Promise<IConsultor[]> {
    return await this.repo.obtener();
  }
}


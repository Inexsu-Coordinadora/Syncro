import { IConsultor } from "../../../dominio/entidades/IConsultor";
import { IRepositorioConsultor } from "../../../dominio/repositorio/IRepositorioConsultor";

export class ListarConsultor {
  constructor(private repo: IRepositorioConsultor) {}

  async ejecutar(): Promise<IConsultor[]> {
    return await this.repo.listar();
  }
}
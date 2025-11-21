import { IConsultor } from "../../../dominio/consultor/entidades/IConsultor"; 
import { IRepositorioConsultor } from "../../../dominio/consultor/repositorio/IRepositorioConsultor"; 

export class ListarConsultor {
  constructor(private repo: IRepositorioConsultor) {}

  async ejecutar(): Promise<IConsultor[]> {
    return await this.repo.obtener();
  }
}

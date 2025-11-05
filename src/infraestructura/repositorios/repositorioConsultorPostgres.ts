import { IRepositorioConsultor } from "../../dominio/repositorio/IRepositorioConsultor.js";
import { IConsultor } from "../../dominio/entidades/IConsultor.js";

export class RepositorioConsultorPostgres implements IRepositorioConsultor {
  private consultores: IConsultor[] = [];

  async crear(consultor: IConsultor): Promise<IConsultor> {
    consultor.idConsultor = (this.consultores.length + 1).toString();
    this.consultores.push(consultor);
    return consultor;
  }

  async actualizar(idConsultor: string, consultor: IConsultor): Promise<IConsultor | null> {
    const index = this.consultores.findIndex(c => c.idConsultor === idConsultor);
    if (index === -1) return null;

    this.consultores[index] = { ...consultor, idConsultor };
    return this.consultores[index];
  }

  async eliminar(idConsultor: string): Promise<boolean> {
    const index = this.consultores.findIndex(c => c.idConsultor === idConsultor);
    if (index === -1) return false;

    this.consultores.splice(index, 1);
    return true;
  }

  async obtener(): Promise<IConsultor[]> {
  return this.consultores;
}

  async obtenerPorId(idConsultor: string): Promise<IConsultor | null> {
    return this.consultores.find(c => c.idConsultor === idConsultor) || null;
  }
}


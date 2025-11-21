import { randomUUID } from "crypto";
import { IConsultor } from "../../../dominio/consultor/entidades/IConsultor"; 
import { IRepositorioConsultor } from "../../../dominio/consultor/repositorio/IRepositorioConsultor";

export class CrearConsultor {
  constructor(private repo: IRepositorioConsultor) {}

  async ejecutar(data: Omit<IConsultor, "idConsultor">): Promise<IConsultor> {
    const nuevoConsultor: IConsultor = {
      idConsultor: randomUUID(),
      nombreConsultor: data.nombreConsultor,
      especialidadConsultor: data.especialidadConsultor,
      emailConsultor: data.emailConsultor,
      ...(data.telefonoConsultor ? { telefonoConsultor: data.telefonoConsultor } : {})
    };

    return await this.repo.crear(nuevoConsultor);
  }
}

import { randomUUID } from "crypto";
import { IConsultor } from "../../dominio/entidades/IConsultor.js";
import { IRepositorioConsultor } from "../../dominio/repositorio/IRepositorioConsultor.js";

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

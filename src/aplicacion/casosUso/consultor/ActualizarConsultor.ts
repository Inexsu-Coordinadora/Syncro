import { IConsultor } from "../../../dominio/entidades/IConsultor";
import { IRepositorioConsultor } from "../../../dominio/repositorio/IRepositorioConsultor";

export class ActualizarConsultor {
  constructor(private repo: IRepositorioConsultor) {}

  async ejecutar(idConsultor: string, datos: Partial<IConsultor>): Promise<IConsultor | null> {
    // Validaciones
    if (datos.nombre !== undefined && datos.nombre.trim() === '') {
      throw new Error('El nombre no puede estar vacío');
    }

    if (datos.emailConsultor !== undefined && !this.validarEmail(datos.emailConsultor)) {
      throw new Error('El email es inválido');
    }

    return await this.repo.actualizar(idConsultor, datos);
  }

  private validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
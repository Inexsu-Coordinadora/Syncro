import { IConsultor } from "../../../dominio/entidades/IConsultor";
import { IRepositorioConsultor } from "../../../dominio/repositorio/IRepositorioConsultor";

export class CrearConsultor {
  constructor(private repo: IRepositorioConsultor) {}

  async ejecutar(consultor: Omit<IConsultor, 'idConsultor'>): Promise<IConsultor> {
    if (!consultor.nombre || consultor.nombre.trim() === '') {
      throw new Error('El nombre es obligatorio');
    }

    if (!consultor.emailConsultor || !this.validarEmail(consultor.emailConsultor)) {
      throw new Error('El email es inválido');
    }

    if (!consultor.especialidad || consultor.especialidad.trim() === '') {
      throw new Error('La especialidad es obligatoria');
    }

    const existe = await this.repo.existeEmail(consultor.emailConsultor);
    if (existe) {
      throw new Error('El email ya está registrado');
    }

    const nuevoConsultor: IConsultor = {
      idConsultor: '0', 
      ...consultor,
    };

    return await this.repo.crear(nuevoConsultor);
  }

  private validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
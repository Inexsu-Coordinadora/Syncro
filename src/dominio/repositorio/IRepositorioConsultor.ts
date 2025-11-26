import { IConsultor } from "../entidades/IConsultor";

export interface IRepositorioConsultor {
  crear(consultor: IConsultor): Promise<IConsultor>;
  actualizar(idConsultor: string, consultor: Partial<IConsultor>): Promise<IConsultor | null>;
  eliminar(idConsultor: string): Promise<boolean>;
  obtenerPorId(idConsultor: string): Promise<IConsultor | null>;
  listar(): Promise<IConsultor[]>;
  existeEmail(email: string): Promise<boolean>;
}
import { IConsultor } from "../entidades/IConsultor";

export interface IRepositorioConsultor {
  crear(consultor: IConsultor): Promise<IConsultor>;
  obtenerPorId(idConsultor: string): Promise<IConsultor | null>;
  actualizar(idConsultor: string, consultor: IConsultor): Promise<IConsultor | null>;
  eliminar(idConsultor: string): Promise<boolean>;
  obtener(): Promise<IConsultor[]>;
}

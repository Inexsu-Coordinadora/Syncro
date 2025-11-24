import { IAsignacion } from '../../entidades/asignar_consultor/IAsignacion';

export interface IRepositorioAsignacion {

  crearAsignacion(asignacion: IAsignacion): Promise<IAsignacion>;
  obtenerAsignacionesSuperpuestas(consultorId: string, fechaInicio: Date, fechaFin: Date): Promise<IAsignacion[]>;
  verificarAsignacionDuplicada(consultorId: string, proyectoId: string, rolConsultor: string | null): Promise<boolean>;
}
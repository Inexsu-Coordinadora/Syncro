export interface ConsultorAsignadoResumen {
  nombre: string;
  rol: string;
}


export interface ProyectoResumen {
  codigo: string;
  nombre: string;
  estado: string;
  fechaInicio: Date;
  fechaFin: Date;
  consultoresAsignados: ConsultorAsignadoResumen[];
}
import { ProyectoResumen } from '../../interfaces/rutas/proyectoResumen';

export interface RespuestaConsultaProyectos {
    mensaje: string;
    proyectos: ProyectoResumen[];
}

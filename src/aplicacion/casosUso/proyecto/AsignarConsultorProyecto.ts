import { IAsignacion } from '../../../dominio/entidades/IAsignacion';
import { IRepositorioAsignacion } from '../../../dominio/repositorio/IRepositorioAsignacion';
import { IRepositorioProyecto } from '../../../dominio/repositorio/IRepositorioProyecto'; 
//import { IRepositorioConsultor } from '../../dominio/repositorio/IRepositorioConsultor'; 

export class AsignarConsultorProyecto {
  constructor(
    private readonly repoAsignacion: IRepositorioAsignacion,
    private readonly repoProyecto: IRepositorioProyecto, 
   // private readonly repoConsultor: IRepositorioConsultor 
  ) {}

  async ejecutar(datos: IAsignacion): Promise<IAsignacion> {
    const { consultorId, proyectoId, fechaInicio, fechaFin, rolConsultor, porcentajeDedicacion } = datos;

    // 1. Verificar existencia de consultor y proyecto
    const proyectoExiste = await this.repoProyecto.obtenerProyectoPorId(proyectoId);
   // const consultorExiste = await this.repoConsultor.obtenerConsultorPorId(consultorId);
    if (!proyectoExiste) throw new Error(`Proyecto ${proyectoId} inexistente.`);
   // if (!consultorExiste) throw new Error(`Consultor ${consultorId} inexistente.`);

    // 2. Validar fechas (fin no puede ser anterior a inicio)
    if (fechaFin < fechaInicio) throw new Error("Fechas inválidas (fin no puede ser anterior a inicio).");

    // 3. Validar asignación idéntica
    const asignacionDuplicada = await this.repoAsignacion.verificarAsignacionDuplicada(consultorId, proyectoId, rolConsultor);
    if (asignacionDuplicada) throw new Error("Asignación duplicada (consultor/proyecto/rol) ya registrada.");

    // 4. Validar dedicación acumulada
    const asignacionesSuperpuestas = await this.repoAsignacion.obtenerAsignacionesSuperpuestas(consultorId, fechaInicio, fechaFin);
    let dedicacionAcumulada = asignacionesSuperpuestas.reduce((sum, current) => sum + current.porcentajeDedicacion, 0);
    dedicacionAcumulada += porcentajeDedicacion;

    if (dedicacionAcumulada > 100) {
      throw new Error(`Exceso de dedicación (>100% por superposición con otras asignaciones). Dedicación resultante: ${dedicacionAcumulada}%.`);
    }
    

    return this.repoAsignacion.crearAsignacion(datos);
  }
}
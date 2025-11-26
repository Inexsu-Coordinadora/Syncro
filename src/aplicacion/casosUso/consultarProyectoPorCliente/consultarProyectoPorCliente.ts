 import { IRepositorioCliente } from '../../dominio/repositorio/IRepositorioCliente';
import { RespuestaConsultaProyectos } from '../../interfaces/rutas/respuestaConsultaProyectos'; 


export class ConsultarProyectosPorCliente {
  
  constructor(private repositorioCliente: IRepositorioCliente) {}

  public async ejecutar(clienteId: string): Promise<RespuestaConsultaProyectos> {
    
    if (!clienteId || clienteId.trim() === '') {
      throw new Error("VALIDACION_ID_REQUERIDO: El ID del cliente es obligatorio.");
    }
    
    const cliente = await this.repositorioCliente.obtenerClientePorId(clienteId);
    
    if (!cliente) {
      throw new Error("CLIENTE_INEXISTENTE: El cliente especificado no existe.");
    }

  
    const proyectos = await this.repositorioCliente.consultarProyectosPorCliente(clienteId);
    
  
    const mensajeRespuesta = proyectos.length > 0
      ? `Se encontraron ${proyectos.length} proyecto${proyectos.length > 1 ? 's' : ''} asociado${proyectos.length > 1 ? 's' : ''} al cliente "${cliente.nombreCliente}".`
      : `El cliente "${cliente.nombreCliente}" existe, pero no tiene proyectos asociados.`;

    return {
      mensaje: mensajeRespuesta,
      proyectos: proyectos
    };
  }
}
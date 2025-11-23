import { ProyectoResumen } from '../../interfaces/rutas/proyectoResumen';  
import { IRepositorioCliente } from '../../dominio/repositorio/IRepositorioCliente';
import { RespuestaConsultaProyectos } from '../../interfaces/rutas/respuestaConsultaProyectos'; 

export class consultarProyectosPorCliente {
  
  constructor(private repositorioCliente: IRepositorioCliente) {}

  public async ejecutar(clienteId: string): Promise<RespuestaConsultaProyectos> {
    if (!clienteId) {
      throw new Error("VALIDACION_ID_REQUERIDO: El ID del cliente es obligatorio.");
    }
    
    const cliente = await this.repositorioCliente.obtenerClientePorId(clienteId);
    
    if (!cliente) {
        throw new Error("CLIENTE_INEXISTENTE: El cliente especificado no existe.");
    }

  
    const proyectos = await this.repositorioCliente.consultarProyectosPorCliente(clienteId);
    let mensajeRespuesta: string;
    
    if (proyectos.length > 0) {
        mensajeRespuesta = `Se encontraron ${proyectos.length} proyectos asociados al cliente "${cliente.nombreCliente}".`;
    } else {
        mensajeRespuesta = `El cliente "${cliente.nombreCliente}" existe, pero no tiene proyectos asociados.`;
    }

    return {
        mensaje: mensajeRespuesta,
        proyectos: proyectos
    };
  }
}

export class ConsultarProyectosPorCliente {
  
  constructor(private repositorioCliente: IRepositorioCliente) {}

  public async ejecutar(clienteId: string): Promise<ProyectoResumen[]> {
    if (!clienteId) {
  
      throw new Error("VALIDACION_ID_REQUERIDO: El ID del cliente es obligatorio.");
    }
    
    const cliente = await this.repositorioCliente.obtenerClientePorId(clienteId);
    
    if (!cliente) {
        throw new Error("CLIENTE_INEXISTENTE: El cliente especificado no existe.");
    }


    const proyectos = await this.repositorioCliente.consultarProyectosPorCliente(clienteId);


    return proyectos;
  }
}

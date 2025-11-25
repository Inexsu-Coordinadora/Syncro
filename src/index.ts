import { crearServidorBase } from './interfaces/servidor';
import { RepositorioProyectoPostgres } from './infraestructura/repositorios/repositorioProyectoPostgres';
import { RepositorioConsultorPostgres } from './infraestructura/repositorios/repositorioConsultorPostgres';
import { proyectoRutas } from './interfaces/rutas/proyectoRutas';
import { CrearProyecto } from './aplicacion/casosUso/proyecto/CrearProyecto';
import { ListarProyectos } from './aplicacion/casosUso/proyecto/ListarProyectos';
import { ObtenerProyectoPorId } from './aplicacion/casosUso/proyecto/ObtenerProyectoPorId';
import { ActualizarProyecto } from './aplicacion/casosUso/proyecto/ActualizarProyecto';
import { EliminarProyecto } from './aplicacion/casosUso/proyecto/EliminarProyecto';
import { RepositorioAsignacionPG } from './infraestructura/repositorios/repositorioAsignacionPostgres';
import { asignacionRutas } from './interfaces/rutas/asignacionRutas';
import { AsignarConsultorProyecto } from './aplicacion/casosUso/asignar_consultor/AsignarConsultorProyecto';
import * as dotenv from 'dotenv';
import { configuration } from './common/configuration'; 


dotenv.config();
const PUERTO = process.env.PUERTO || 3000;

const start = async () => {
  try {
    const servidor = crearServidorBase();
    const repositorioProyectos = new RepositorioProyectoPostgres(servidor);
    const repositorioConsultores = new RepositorioConsultorPostgres(servidor); 
    const repositorioAsignaciones = new RepositorioAsignacionPG(servidor); 
    const crear = new CrearProyecto(repositorioProyectos);
    const consultarTodos = new ListarProyectos(repositorioProyectos);
    const consultarPorId = new ObtenerProyectoPorId(repositorioProyectos);
    const actualizar = new ActualizarProyecto(repositorioProyectos);
    const eliminar = new EliminarProyecto(repositorioProyectos); 


    const asignarConsultor = new AsignarConsultorProyecto(
        repositorioAsignaciones, 
        repositorioProyectos, 
        repositorioConsultores 
    );

    // Registrar rutas de Proyectos 
    servidor.register(proyectoRutas(
        crear, 
        consultarTodos, 
        consultarPorId,
        actualizar,
        eliminar
    ), { prefix: '/api/proyectos' });

    // Registrar rutas de Asignaciones
    servidor.register(asignacionRutas(asignarConsultor), { prefix: '/api/asignaciones' });

    await servidor.listen({ port: Number(PUERTO) });
    console.log(`Servidor de Proyectos iniciado en http://localhost:${PUERTO}`);

  } catch (err: any) {
    console.error(`[ERROR] Fallo al iniciar el servidor: ${err.message}`);
    process.exit(1);
  }
};

start();
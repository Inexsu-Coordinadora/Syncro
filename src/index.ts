import { crearServidorBase } from './interfaces/servidor';
import { RepositorioProyectoPostgres } from './infraestructura/repositorios/repositorioProyectoPostgres';
//import { RepositorioConsultorPG } from './infraestructura/repositorios/repositorioConsultorPostgres'; 
import { proyectoRutas } from './interfaces/rutas/proyectoRutas';
import { CrearProyecto } from './aplicacion/casosUso/proyecto/CrearProyecto';
import { ListarProyectos } from './aplicacion/casosUso/proyecto/ListarProyectos';
import { ObtenerProyectoPorId } from './aplicacion/casosUso/proyecto/ObtenerProyectoPorId';
import { ActualizarProyecto } from './aplicacion/casosUso/proyecto/ActualizarProyecto';
import { EliminarProyecto } from './aplicacion/casosUso/proyecto/EliminarProyecto';
import { RepositorioAsignacionPG } from './infraestructura/repositorios/repositorioAsignacionPostgres'; // Asegúrate que esta ruta sea correcta
import { asignacionRutas } from './interfaces/rutas/asignacionRutas';
import { AsignarConsultorProyecto } from './aplicacion/casosUso/proyecto/AsignarConsultorProyecto';
// ----------------------------------------

import * as dotenv from 'dotenv';

dotenv.config();
const PUERTO = process.env.PUERTO || 3000;

const start = async () => {
  try {
    const servidor = crearServidorBase();

    const repositorioProyectos = new RepositorioProyectoPostgres(servidor);
    //const repositorioConsultores = new RepositorioConsultor(servidor); 
    const repositorioAsignaciones = new RepositorioAsignacionPG(servidor); 
    const crear = new CrearProyecto(repositorioProyectos);
    const consultarTodos = new ListarProyectos(repositorioProyectos);
    const consultarPorId = new ObtenerProyectoPorId(repositorioProyectos);
    const actualizar = new ActualizarProyecto(repositorioProyectos);
    const eliminar = new EliminarProyecto(repositorioProyectos); 

    // --- INSTANCIAR NUEVO CASO DE USO DE ASIGNACIONES ---
    const asignarConsultor = new AsignarConsultorProyecto(
        repositorioAsignaciones, 
        repositorioProyectos, 
        //repositorioConsultores
    );
  -

    // Registrar rutas de Proyectos 
    servidor.register(proyectoRutas(
        crear, 
        consultarTodos, 
        consultarPorId,
        actualizar,
        eliminar
    ), { prefix: '/api/proyectos' });

    servidor.register(asignacionRutas(asignarConsultor), { prefix: '/api/asignaciones' });
    // ---------------------------------------------


    await servidor.listen({ port: Number(PUERTO) });
    console.log(`Servidor de Proyectos iniciado en http://localhost:${PUERTO}`);

  } catch (err: any) {
    console.error(`[ERROR] Fallo al iniciar el servidor: ${err.message}`);
    process.exit(1);
  }
};

start();
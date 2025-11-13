import { crearServidorBase } from './interfaces/servidor';
import { RepositorioProyectoPostgres } from './infraestructura/repositorios/repositorioProyectoPostgres';
// Debes asegurarte de que esta ruta para Consultores sea correcta en tu proyecto
//import { RepositorioConsultorPG } from './infraestructura/repositorios/repositorioConsultorPostgres'; 

import { proyectoRutas } from './interfaces/rutas/proyectoRutas';
import { CrearProyecto } from './aplicacion/casosUso/CrearProyecto';
import { ListarProyectos } from './aplicacion/casosUso/ListarProyectos';
import { ObtenerProyectoPorId } from './aplicacion/casosUso/ObtenerProyectoPorId';
import { ActualizarProyecto } from './aplicacion/casosUso/ActualizarProyecto';
import { EliminarProyecto } from './aplicacion/casosUso/EliminarProyecto';

// --- NUEVOS IMPORTS PARA ASIGNACIONES ---
import { RepositorioAsignacionPG } from './infraestructura/repositorios/repositorioAsignacionPostgres'; // Asegúrate que esta ruta sea correcta
import { rutasAsignaciones } from './interfaces/rutas/rutasAsignaciones';
import { AsignarConsultorProyectoUC } from './aplicacion/casosUso/AsignarConsultorProyectoUC';
// ----------------------------------------

import * as dotenv from 'dotenv';

dotenv.config();
const PUERTO = process.env.PUERTO || 3000;

const start = async () => {
  try {
    const servidor = crearServidorBase();

    // Instanciar repositorios existentes
    const repositorioProyectos = new RepositorioProyectoPostgres(servidor);
    const repositorioConsultores = new RepositorioConsultorPG(servidor); // Instanciar repositorio de consultores
    
    // --- INSTANCIAR NUEVO REPOSITORIO DE ASIGNACIONES ---
    const repositorioAsignaciones = new RepositorioAsignacionPG(servidor); 
    // ----------------------------------------------------


    // Instanciar casos de uso de Proyectos (existentes)
    const crear = new CrearProyecto(repositorioProyectos);
    const consultarTodos = new ListarProyectos(repositorioProyectos);
    const consultarPorId = new ObtenerProyectoPorId(repositorioProyectos);
    const actualizar = new ActualizarProyecto(repositorioProyectos);
    const eliminar = new EliminarProyecto(repositorioProyectos); // Corregir nombre de la variable aquí si es necesario

    // --- INSTANCIAR NUEVO CASO DE USO DE ASIGNACIONES ---
    // Inyectamos los 3 repositorios necesarios para las validaciones
    const asignarConsultorUC = new AsignarConsultorProyectoUC(
        repositorioAsignaciones, 
        repositorioProyectos, 
        repositorioConsultores
    );
    // -----------------------------------------------------

    // Registrar rutas de Proyectos (existentes)
    servidor.register(proyectoRutas(
        crear, 
        consultarTodos, 
        consultarPorId,
        actualizar,
        eliminar
    ), { prefix: '/api/proyectos' });

    // --- REGISTRAR NUEVAS RUTAS DE ASIGNACIONES ---
    servidor.register(rutasAsignaciones(asignarConsultorUC), { prefix: '/api/asignaciones' });
    // ---------------------------------------------


    await servidor.listen({ port: Number(PUERTO) });
    console.log(`Servidor de Proyectos iniciado en http://localhost:${PUERTO}`);

  } catch (err: any) {
    console.error(`[ERROR] Fallo al iniciar el servidor: ${err.message}`);
    process.exit(1);
  }
};

start();
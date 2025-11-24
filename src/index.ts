import Fastify from 'fastify';
import consultorRutas from './interfaces/consultor/rutas/consultorRutas'; 
import * as dotenv from 'dotenv';


dotenv.config();

const configuration = {
    httpPuerto: Number(process.env.PUERTO),
    basedatos: {
        Host: process.env.PGHOST,
        Puerto: Number(process.env.PGPORT),
        usuario: process.env.PGUSER,
        clave: process.env.PGPASSWORD,
        dbNombre: process.env.PGDATABASE,
    },
};

const app = Fastify({ 
    logger: true 
});
app.register(consultorRutas, { prefix: '/api' }); 


async function startServer() {
    try {
        
        await app.listen({ port: configuration.httpPuerto, host: '0.0.0.0' }); 
        

        console.log(`Server listening on port ${configuration.httpPuerto}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}
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
startServer();
<<<<<<< HEAD
import dotenv from "dotenv";

dotenv.config();

export const configuration = {
    httpPuerto: Number(process.env.PUERTO),
    baseDatos: {
        host: process.env.PGHOST,
        puerto: Number(process.env.PGPORT),
        usuario: process.env.PGUSER,
        clave: process.env.PGPASSWORD,
        dbNombre: process.env.PGDATABASE,
    },
=======
import { crearServidorBase } from './interfaces/servidor';
import { RepositorioProyectoPostgres } from './infraestructura/repositorios/repositorioProyectoPostgres';
import { proyectoRutas } from './interfaces/rutas/proyectoRutas';
import { CrearProyecto } from './aplicacion/casosUso/CrearProyecto';
import { ListarProyectos } from './aplicacion/casosUso/ListarProyectos';
import { ObtenerProyectoPorId } from './aplicacion/casosUso/ObtenerProyectoPorId';
import { ActualizarProyecto } from './aplicacion/casosUso/ActualizarProyecto';
import { EliminarProyecto } from './aplicacion/casosUso/EliminarProyecto';
import * as dotenv from 'dotenv';


dotenv.config();
const PUERTO = process.env.PUERTO || 3000;
const start = async () => {
  try {
    const servidor = crearServidorBase();
    const repositorioProyectos = new RepositorioProyectoPostgres(servidor);
    const crear = new CrearProyecto(repositorioProyectos);
    const consultarTodos = new ListarProyectos(repositorioProyectos);
    const consultarPorId = new ObtenerProyectoPorId(repositorioProyectos);
    const actualizar = new ActualizarProyecto(repositorioProyectos);
    const eliminar = new EliminarProyecto(repositorioProyectos);


    servidor.register(proyectoRutas(
        crear, 
        consultarTodos, 
        consultarPorId,
        actualizar,
        eliminar
    ), { prefix: '/api/proyectos' });



    await servidor.listen({ port: Number(PUERTO) });
    console.log(`Servidor de Proyectos iniciado en http://localhost:${PUERTO}`);

  } catch (err: any) {
    console.error(`[ERROR] Fallo al iniciar el servidor: ${err.message}`);
    process.exit(1);
  }
>>>>>>> d5736851b1ecd97eebada62980a771e97d2cd686
};

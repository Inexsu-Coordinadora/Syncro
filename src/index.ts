import Fastify from "fastify";
import dotenv from "dotenv";

// CLIENTES / PROYECTOS / TAREAS
import { clienteRutas } from "./interfaces/rutas/clienteRutas";
import { proyectoRutas } from "./interfaces/rutas/proyectoRutas";
import { tareaRutas } from "./interfaces/rutas/tarearRutas";

// REPOSITORIOS
import { RepositorioClientePostgres } from "./infraestructura/repositorios/repositorioClientePostgres";
import { RepositorioProyectoPostgres } from "./infraestructura/repositorios/repositorioProyectoPostgres";
import { RepositorioTareaPostgres } from "./infraestructura/repositorios/RepositorioTareaPostgres";

// CASOS DE USO CLIENTES
import { CrearCliente } from "./aplicacion/casosUso/cliente/crearCliente";
import { ListarClientes } from "./aplicacion/casosUso/cliente/ListarClientes";
import { ObtenerClientePorId } from "./aplicacion/casosUso/cliente/ObtenerClientePorId";
import { ActualizarCliente } from "./aplicacion/casosUso/cliente/ActualizarCliente";
import { EliminarCliente } from "./aplicacion/casosUso/cliente/EliminarCliente";

// CASOS DE USO PROYECTOS
import { CrearProyecto } from "./aplicacion/casosUso/proyecto/CrearProyecto";
import { ListarProyectos } from "./aplicacion/casosUso/proyecto/ListarProyectos";
import { ObtenerProyectoPorId } from "./aplicacion/casosUso/proyecto/ObtenerProyectoPorId";
import { ActualizarProyecto } from "./aplicacion/casosUso/proyecto/ActualizarProyecto";
import { EliminarProyecto } from "./aplicacion/casosUso/proyecto/EliminarProyecto";

// CASOS DE USO TAREAS
import { CrearTarea } from "./aplicacion/casosUso/tarea/CrearTarea";
import { ListarTareas } from "./aplicacion/casosUso/tarea/ListarTareas";
import { ObtenerTareaPorId } from "./aplicacion/casosUso/tarea/ObtenerTareaPorId";
import { ActualizarTarea } from "./aplicacion/casosUso/tarea/ActualizarTarea";
import { EliminarTarea } from "./aplicacion/casosUso/tarea/EliminarTarea";

dotenv.config();
const PUERTO = process.env.PUERTO || 3000;

const app = Fastify({ logger: true });

async function start() {
  try {
    // REPOSITORIOS
    const repoClientes = new RepositorioClientePostgres(app);
    const repoProyectos = new RepositorioProyectoPostgres(app);
    const repoTareas = new RepositorioTareaPostgres(app);

    // CASOS DE USO CLIENTES
    const crearCliente = new CrearCliente(repoClientes);
    const listarClientes = new ListarClientes(repoClientes);
    const obtenerClientePorId = new ObtenerClientePorId(repoClientes);
    const actualizarCliente = new ActualizarCliente(repoClientes);
    const eliminarCliente = new EliminarCliente(repoClientes);

    // CASOS DE USO PROYECTOS
    const crearProyecto = new CrearProyecto(repoProyectos);
    const listarProyectos = new ListarProyectos(repoProyectos);
    const obtenerProyectoPorId = new ObtenerProyectoPorId(repoProyectos);
    const actualizarProyecto = new ActualizarProyecto(repoProyectos);
    const eliminarProyecto = new EliminarProyecto(repoProyectos);

    // CASOS DE USO TAREAS
    const crearTarea = new CrearTarea(repoTareas);
    const listarTareas = new ListarTareas(repoTareas);
    const obtenerTareaPorId = new ObtenerTareaPorId(repoTareas);
    const actualizarTarea = new ActualizarTarea(repoTareas);
    const eliminarTarea = new EliminarTarea(repoTareas);

    // REGISTRO DE RUTAS
    app.register(
      clienteRutas(
        crearCliente,
        listarClientes,
        obtenerClientePorId,
        actualizarCliente,
        eliminarCliente
      ),
      { prefix: "/api/clientes" }
    );

    app.register(
      proyectoRutas(
        crearProyecto,
        listarProyectos,
        obtenerProyectoPorId,
        actualizarProyecto,
        eliminarProyecto
      ),
      { prefix: "/api/proyectos" }
    );

    app.register(
      tareaRutas(
        crearTarea,
        listarTareas,
        obtenerTareaPorId,
        actualizarTarea,
        eliminarTarea
      ),
      { prefix: "/api/tareas" }
    );

    // INICIO SERVIDOR
    await app.listen({ port: Number(PUERTO), host: "0.0.0.0" });
    console.log(`Servidor iniciado en http://localhost:${PUERTO}`);
  } catch (err: any) {
    app.log.error(err);
    process.exit(1);
  }
}

start();

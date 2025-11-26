import Fastify from "fastify";
import dotenv from "dotenv";
import fastifyPostgres from "@fastify/postgres";

// RUTAS
import { clienteRutas } from "./interfaces/rutas/clienteRutas";
import { proyectoRutas } from "./interfaces/rutas/proyectoRutas";
import { tareaRutas } from "./interfaces/rutas/tareaRutas";
import { asignacionRutas } from "./interfaces/rutas/asignacionRutas";

// REPOSITORIOS
import { RepositorioClientePostgres } from "./infraestructura/repositorios/repositorioClientePostgres";
import { RepositorioProyectoPostgres } from "./infraestructura/repositorios/repositorioProyectoPostgres";
import { RepositorioTareaPostgres } from "./infraestructura/repositorios/RepositorioTareaPostgres";
import { RepositorioConsultorPostgres } from "./infraestructura/repositorios/repositorioConsultorPostgres";
import { RepositorioAsignacionPG } from "./infraestructura/repositorios/repositorioAsignacionPostgres";

// CASOS DE USO CLIENTE
import { CrearCliente } from "./aplicacion/casosUso/cliente/crearCliente";
import { ListarClientes } from "./aplicacion/casosUso/cliente/ListarClientes";
import { ObtenerClientePorId } from "./aplicacion/casosUso/cliente/ObtenerClientePorId";
import { ActualizarCliente } from "./aplicacion/casosUso/cliente/ActualizarCliente";
import { EliminarCliente } from "./aplicacion/casosUso/cliente/EliminarCliente";

// CASOS DE USO PROYECTO
import { CrearProyecto } from "./aplicacion/casosUso/proyecto/CrearProyecto";
import { ListarProyectos } from "./aplicacion/casosUso/proyecto/ListarProyectos";
import { ObtenerProyectoPorId } from "./aplicacion/casosUso/proyecto/ObtenerProyectoPorId";
import { ActualizarProyecto } from "./aplicacion/casosUso/proyecto/ActualizarProyecto";
import { EliminarProyecto } from "./aplicacion/casosUso/proyecto/EliminarProyecto";

// CASOS DE USO TAREA
import { CrearTarea } from "./aplicacion/casosUso/tarea/CrearTarea";
import { ListarTareas } from "./aplicacion/casosUso/tarea/ListarTareas";
import { ObtenerTareaPorId } from "./aplicacion/casosUso/tarea/ObtenerTareaPorId";
import { ActualizarTarea } from "./aplicacion/casosUso/tarea/ActualizarTarea";
import { EliminarTarea } from "./aplicacion/casosUso/tarea/EliminarTarea";

// CASO DE USO ASIGNACIÓN CONSULTOR
import { AsignarConsultorProyecto } from "./aplicacion/casosUso/asignar_consultor/AsignarConsultorProyecto";

dotenv.config();
const PUERTO = process.env.PUERTO || 3000;

// Crear servidor Fastify
const app = Fastify({ logger: true });

// Registro de plugin PostgreSQL
app.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL,
});

async function start() {
  try {
    // REPOSITORIOS
    const repoClientes = new RepositorioClientePostgres(app);
    const repoProyectos = new RepositorioProyectoPostgres(app);
    const repoTareas = new RepositorioTareaPostgres(app);
    const repoConsultores = new RepositorioConsultorPostgres(app);
    const repoAsignaciones = new RepositorioAsignacionPG(app);

    // CASOS DE USO CLIENTE
    const crearCliente = new CrearCliente(repoClientes);
    const listarClientes = new ListarClientes(repoClientes);
    const obtenerClientePorId = new ObtenerClientePorId(repoClientes);
    const actualizarCliente = new ActualizarCliente(repoClientes);
    const eliminarCliente = new EliminarCliente(repoClientes);

    // CASOS DE USO PROYECTO
    const crearProyecto = new CrearProyecto(repoProyectos);
    const listarProyectos = new ListarProyectos(repoProyectos);
    const obtenerProyectoPorId = new ObtenerProyectoPorId(repoProyectos);
    const actualizarProyecto = new ActualizarProyecto(repoProyectos);
    const eliminarProyecto = new EliminarProyecto(repoProyectos);

    // CASOS DE USO TAREA
    const crearTarea = new CrearTarea(repoTareas);
    const listarTareas = new ListarTareas(repoTareas);
    const obtenerTareaPorId = new ObtenerTareaPorId(repoTareas);
    const actualizarTarea = new ActualizarTarea(repoTareas);
    const eliminarTarea = new EliminarTarea(repoTareas);

    // CASO DE USO ASIGNACIÓN CONSULTOR
    const asignarConsultor = new AsignarConsultorProyecto(
      repoAsignaciones,
      repoProyectos,
      repoConsultores
    );

    // REGISTRO DE RUTAS
    app.register(
      clienteRutas(crearCliente, listarClientes, obtenerClientePorId, actualizarCliente, eliminarCliente),
      { prefix: "/api/clientes" }
    );

    app.register(
      proyectoRutas(crearProyecto, listarProyectos, obtenerProyectoPorId, actualizarProyecto, eliminarProyecto),
      { prefix: "/api/proyectos" }
    );

    app.register(
      tareaRutas(crearTarea, listarTareas, obtenerTareaPorId, actualizarTarea, eliminarTarea),
      { prefix: "/api/tareas" }
    );

    app.register(
      asignacionRutas(asignarConsultor),
      { prefix: "/api/asignaciones" }
    );

    // INICIAR SERVIDOR
    await app.listen({ port: Number(PUERTO), host: "0.0.0.0" });
    console.log(`Servidor iniciado en http://localhost:${PUERTO}`);
  } catch (err: any) {
    app.log.error(err);
    process.exit(1);
  }
}

start();


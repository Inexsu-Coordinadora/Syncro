import { crearServidorBase } from './interfaces/servidor';
import { RepositorioProyectoPostgres } from './infraestructura/repositorios/repositorioProyectoPostgres';
import { proyectoRutas } from './interfaces/rutas/proyectoRutas';
import { clienteRutas } from './interfaces/rutas/clienteRutas';
import { CrearProyecto } from './aplicacion/casosUso/CrearProyecto';
import { ListarProyectos } from './aplicacion/casosUso/ListarProyectos';
import { ObtenerProyectoPorId } from './aplicacion/casosUso/ObtenerProyectoPorId';
import { ActualizarProyecto } from './aplicacion/casosUso/ActualizarProyecto';
import { EliminarProyecto } from './aplicacion/casosUso/EliminarProyecto';
import { configuration } from './configuracion/config';

const PUERTO = configuration.httpPuerto || 3000;
const start = async () => {
  let servidor;
  try {
    servidor = await crearServidorBase();
    
    console.log('Configurando repositorios y casos de uso...');
    const repositorioProyectos = new RepositorioProyectoPostgres(servidor);
    const crear = new CrearProyecto(repositorioProyectos);
    const consultarTodos = new ListarProyectos(repositorioProyectos);
    const consultarPorId = new ObtenerProyectoPorId(repositorioProyectos);
    const actualizar = new ActualizarProyecto(repositorioProyectos);
    const eliminar = new EliminarProyecto(repositorioProyectos);


  await servidor.register(proyectoRutas(
        crear, 
        consultarTodos, 
        consultarPorId,
        actualizar,
        eliminar
    ), { prefix: '/api/proyectos' });

  // Registrar rutas de clientes (exponer /clientes)
  await servidor.register(clienteRutas, { prefix: '/clientes' });



    console.log('Iniciando servidor en puerto ' + PUERTO);
    await servidor.listen({ port: Number(PUERTO), host: '0.0.0.0' });
    console.log(`✅ Servidor iniciado en http://localhost:${PUERTO}`);
    console.log(`Health check disponible en http://localhost:${PUERTO}/health`);

  } catch (err: any) {
    console.error(`❌ Error al iniciar el servidor: ${err.message}`);
    process.exit(1);
  }

  // Manejo de señales de terminación
  const signals = ['SIGTERM', 'SIGINT'];
  
  for (const signal of signals) {
    process.on(signal, async () => {
      console.log(`\nRecibida señal ${signal}, cerrando servidor...`);
      try {
        if (servidor) {
          await servidor.close();
          console.log('✅ Servidor cerrado correctamente');
        }
        process.exit(0);
      } catch (err: any) {
        console.error('❌ Error al cerrar el servidor:', err?.message || err);
        process.exit(1);
      }
    });
  }
};

// Iniciar servidor
console.log('Iniciando aplicación...');
start();
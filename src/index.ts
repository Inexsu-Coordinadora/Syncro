import { RepositorioProyectoPostgres } from './infraestructura/repositorios/repositorioProyectoPostgres';
import { crearServidorBase, configurarRutas } from './interfaces/servidor';
import * as dotenv from 'dotenv';

const PUERTO = process.env.PUERTO || 3000;
dotenv.config();
const start = async () => {
  try {
    const servidor = crearServidorBase();
    const repositorioProyectos = new RepositorioProyectoPostgres(servidor);

    configurarRutas(servidor, repositorioProyectos);
    await servidor.listen({ port: Number(PUERTO) });
    console.log(`Servidor de Proyectos iniciado en http://localhost:${PUERTO}`);
  } catch (err: any) {
    console.error(`Fallo al iniciar el servidor: ${err.message}`);
    process.exit(1);
  }
};

start();
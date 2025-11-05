import fastify from 'fastify';
import { configuration } from '..';
import { clienteRutas } from './rutas/clienteRutas';

const server = fastify({
    logger: true
});

// Registrar rutas
server.register(clienteRutas, { prefix: '/clientes' });

// Iniciar el servidor
const startServer = async () => {
    try {
        await server.listen({ 
            port: configuration.httpPuerto,
            host: '0.0.0.0'
        });
        console.log(`⚡🚀Servidor iniciado en puerto ${configuration.httpPuerto}⚡🚀`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

startServer();
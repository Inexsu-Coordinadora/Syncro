import Fastify from 'fastify';
import dotenv from 'dotenv';
import consultorRutas from './interfaces/consultor/rutas/consultorRutas'; 


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


async function start() {
    try {
        
        await app.listen({ port: configuration.httpPuerto, host: '0.0.0.0' }); 
        

        console.log(`Server listening on port ${configuration.httpPuerto}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}
start();
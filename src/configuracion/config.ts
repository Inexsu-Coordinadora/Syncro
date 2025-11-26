import * as dotenv from 'dotenv';

dotenv.config();

export const configuration = {
    httpPuerto: Number(process.env.PUERTO) || 3000,
    baseDatos: {
        host: process.env.PGHOST || 'localhost',
        puerto: Number(process.env.PGPORT) || 5432,
        usuario: process.env.PGUSER || 'postgres',
        clave: process.env.PGPASSWORD || 'postgres',
        dbNombre: process.env.PGDATABASE || process.env.PGDBNAME || 'syncro_db',
    },
};
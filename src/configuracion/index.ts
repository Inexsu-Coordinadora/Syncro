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
};

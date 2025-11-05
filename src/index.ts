import dotenv from "dotenv";

dotenv.config();

export const configuration = {
    httpPuerto: Number(process.env.HTTP_PORT) || 3000, 
    baseDatos: {
        host: process.env.PGHOST || "localhost",
        puerto: Number(process.env.PGPORT) || 5432, 
        usuario: process.env.PGUSER || "postgres", 
        clave: process.env.PGPASSWORD, 
        dbNombre: process.env.PGDATABASE, 
    },
};
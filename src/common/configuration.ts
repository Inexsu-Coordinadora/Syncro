import dotenv from "dotenv";
dotenv.config();

export const configuration = {
  httpPuerto: Number(process.env.PUERTO),
  dbType: String(process.env.DBTYPE),
  baseDatos: {
    host: process.env.PGHOST,
    puerto: Number(process.env.PGPORT),
    usuario: process.env.PGUSER,
    contrasena: process.env.PGPASSWORD,
    nombreDb: process.env.PGDBNAME,
  }
};

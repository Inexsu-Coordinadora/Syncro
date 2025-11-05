import { Pool } from "pg";
import { configuration } from "..";


const pool = new Pool({
    host: configuration.baseDatos.host,
    user: configuration.baseDatos.usuario,
    database: configuration.baseDatos.dbNombre,
    port: configuration.baseDatos.puerto,
    password: configuration.baseDatos.clave, 
});

export async function ejecutarConsulta(
    consulta: string,
    parametros?: Array<number | string>
) {
    return await pool.query(consulta, parametros);
}

export interface ICliente {
    id_cliente?: string;
    nombre_cliente: string;
    email_cliente: string;
    telefono_cliente?: string | undefined;
    direccion_cliente?: string | undefined;
    empresa_cliente?: string | undefined;
}


    //proyectos?: IProyecto[]; // Relación con proyectos
    //consultores?: IConsultor[];// Relación con consultores

export interface ICliente {
    idCliente?: string;
    nombreCliente: string;
    emailCliente: string;
    telefonoCliente: string;
    direccionCliente: string;
    empresaCliente?: string;

    //proyectos?: IProyecto[]; // Relación con proyectos
    //consultores?: IConsultor[];// Relación con consultores
}

export interface IProyecto {
    idProyecto? : string | undefined;
    nombreProyecto: string;
    descripcionProyecto: string;
    clienteId : string;
    fechaInicio: Date;
    fechaFin: Date
    estadoProyecto: string;
    consultorAsignado: string;
    rolesDefinidos: string    
}

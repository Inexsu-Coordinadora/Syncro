export interface IProyecto {
    idProyecto? : string | undefined;
    nombreProyecto: string;
    descripcionProyecto: string;
    clienteId : string;
    fecha_inicio: Date;
    fecha_fin: Date
    estadoProyecto: string;
    consultor_asignado: string;
    roles_definidos: string    
}

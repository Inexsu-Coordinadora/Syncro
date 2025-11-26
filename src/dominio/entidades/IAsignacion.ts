export interface IAsignacion {
    
    idAsignacion? : number;
    consultorId: string;
    proyectoId: string;
    rolConsultor: string | null;
    porcentajeDedicacion: number;
    fechaInicio: Date;
    fechaFin: Date;

}
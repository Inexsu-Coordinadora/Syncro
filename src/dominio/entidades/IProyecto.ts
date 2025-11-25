export interface IProyecto {
    id_proyecto?: string;
    codigo_proyecto: string;
    nombre_proyecto: string;
    descripcion_proyecto: string;
    fecha_inicio: string;  
    fecha_fin?: string | null;
    estado_proyecto: "Planificado" | "En ejecución" | "Finalizado";
    id_cliente: string;
    consultor_asignado?: string | null;
    roles_definidos?: string | null;
}

//Interface
export interface IProyecto {
    id_proyecto?: string;
    codigo_proyecto: string;
    nombre_proyecto: string;
    descripcion_proyecto: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    estado_proyecto: string;
    id_cliente: string;
}

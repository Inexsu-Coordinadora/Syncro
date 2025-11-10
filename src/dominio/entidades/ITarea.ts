export interface ITarea {
    id_tarea?: string;
    codigo_tarea: string;
    nombre_tarea: string;
    estado: "pendiente" | "en_progreso" | "bloqueada" | "completada";
    fecha_limite: string;
    id_proyecto: string;
    id_consultor?: string | null;
}

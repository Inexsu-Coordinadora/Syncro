
import { z } from "zod";

export const TareaEsquema = z.object({
    codigo_tarea: z.string().min(1, "El código de la tarea es obligatorio"),
    nombre_tarea: z.string().min(1, "El nombre de la tarea es obligatorio"),
    estado: z.enum(["pendiente", "en_progreso", "bloqueada", "completada"]),
    fecha_limite: z.string().refine((s) => !Number.isNaN(Date.parse(s)), "Fecha inválida"),
    id_proyecto: z.string().uuid("El id_proyecto debe ser un UUID válido"),
    id_consultor: z.string().uuid("El id_consultor debe ser un UUID válido").optional(),
});

export type TareaInput = z.input<typeof TareaEsquema>;  
export type TareaParsed = z.output<typeof TareaEsquema>; 

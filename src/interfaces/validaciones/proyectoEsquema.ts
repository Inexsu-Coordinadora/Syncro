import { z } from "zod";

export const ProyectoEsquema = z.object({
    codigo_proyecto: z.string().min(1),
    nombre_proyecto: z.string().min(1),
    descripcion_proyecto: z.string().min(1),
    fecha_inicio: z.string().refine((s) => !Number.isNaN(Date.parse(s)), "Fecha inválida"),
    fecha_fin: z.string().refine((s) => !Number.isNaN(Date.parse(s)), "Fecha inválida").optional(),
    estado_proyecto: z.enum(["Planificado", "En ejecución", "Finalizado"]),
    id_cliente: z.string().uuid("El id_cliente debe ser un UUID válido"),
    consultor_asignado: z.string().nullable().optional(),
    roles_definidos: z.string().nullable().optional(),
});

export type ProyectoInput = z.input<typeof ProyectoEsquema>;
export type ProyectoParsed = z.output<typeof ProyectoEsquema>;

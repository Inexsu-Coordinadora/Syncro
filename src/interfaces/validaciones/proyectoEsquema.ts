import { z } from "zod";

export const ProyectoEsquema = z.object({
    nombreProyecto: z.string().min(1, "El nombre del proyecto es obligatorio"),
    descripcionProyecto: z.string().min(1, "La descripción es obligatoria"),

    clienteId: z.string().uuid("clienteId debe ser un UUID válido"),

    fecha_inicio: z.string()
        .refine((s) => !Number.isNaN(Date.parse(s)), "Fecha de inicio inválida"),

    fecha_fin: z.string()
        .refine((s) => !Number.isNaN(Date.parse(s)), "Fecha fin inválida")
        .optional(),

    estadoProyecto: z.enum(["Planificado", "En ejecución", "Finalizado"] as const, "El estado del proyecto es obligatorio"),

    consultor_asignado: z.string().nullable().optional(),
    roles_definidos: z.string().nullable().optional(),
});

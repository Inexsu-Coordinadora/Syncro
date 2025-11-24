import { z } from "zod";

export const ProyectoEsquema = z.object({
    nombreProyecto: z.string().min(1, "El nombre del proyecto es obligatorio"),
    descripcionProyecto: z.string().min(1, "La descripción es obligatoria"),
    clienteId: z.string().uuid("El clienteId debe ser un UUID válido"),
    fecha_inicio: z.string().refine((s) => !Number.isNaN(Date.parse(s)), "Fecha inválida")
        .transform((s) => new Date(s)),
    fecha_fin: z.string().refine((s) => !Number.isNaN(Date.parse(s)), "Fecha inválida")
        .transform((s) => new Date(s)),
    estadoProyecto: z.enum(["Planificado", "En ejecución", "Finalizado"]),
    consultor_asignado: z.string().min(1, "Consultor asignado requerido"),
    roles_definidos: z.string().min(1, "Roles definidos requeridos"),
});

export type ProyectoInput = z.input<typeof ProyectoEsquema>;  
export type ProyectoParsed = z.output<typeof ProyectoEsquema>; 
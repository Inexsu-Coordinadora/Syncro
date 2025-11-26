import { z } from "zod";

export const ClienteEsquema = z.object({
    nombre_cliente: z.string().min(1, "El nombre es obligatorio"),
    email_cliente: z.string().email("Correo inválido"),
    telefono_cliente: z.string().optional(),
    direccion_cliente: z.string().optional(),
    empresa_cliente: z.string().optional()
});


import Fastify from "fastify";
import { tareaRutas } from "../../../interfaces/rutas/tareaRutas";
import { CrearTarea } from "../../../aplicacion/casosUso/tarea/CrearTarea";
import { ListarTareas } from "../../../aplicacion/casosUso/tarea/ListarTareas";
import { ObtenerTareaPorId } from "../../../aplicacion/casosUso/tarea/ObtenerTareaPorId";
import { ActualizarTarea } from "../../../aplicacion/casosUso/tarea/ActualizarTarea";
import { EliminarTarea } from "../../../aplicacion/casosUso/tarea/EliminarTarea";

// Mocks de casos de uso
const crear = { ejecutar: jest.fn() };
const listar = { ejecutar: jest.fn() };
const obtenerPorId = { ejecutar: jest.fn() };
const actualizar = { ejecutar: jest.fn() };
const eliminar = { ejecutar: jest.fn() };

// Construye la app Fastify con las rutas registradas
function buildApp() {
    const app = Fastify();

    app.register(
        tareaRutas(
            crear as unknown as CrearTarea,
            listar as unknown as ListarTareas,
            obtenerPorId as unknown as ObtenerTareaPorId,
            actualizar as unknown as ActualizarTarea,
            eliminar as unknown as EliminarTarea
        ),
        { prefix: "/tareas" }
    );

    return app;
}

describe("tareaRutas integración", () => {
    let app: ReturnType<typeof buildApp>;

    beforeEach(() => {
        jest.clearAllMocks();
        app = buildApp();
    });

    test("POST /tareas devuelve 201 al crear", async () => {
        const nuevaTarea = {
            codigo_tarea: "T-001",
            nombre_tarea: "Implementar API",
            estado: "pendiente",
            fecha_limite: "2025-12-01T00:00:00Z",
            id_proyecto: "uuid-proyecto",
        };

        crear.ejecutar.mockResolvedValue({ id_tarea: "uuid-tarea", ...nuevaTarea });

        const res = await app.inject({
            method: "POST",
            url: "/tareas",
            payload: nuevaTarea,
        });

        expect(res.statusCode).toBe(201);
        expect(JSON.parse(res.body).id_tarea).toBe("uuid-tarea");
    });

    test("GET /tareas/:id devuelve 404 si no existe", async () => {
        obtenerPorId.ejecutar.mockResolvedValue(null);

        const res = await app.inject({
            method: "GET",
            url: "/tareas/no-existe",
        });

        expect(res.statusCode).toBe(404);
        expect(JSON.parse(res.body).mensaje).toMatch(/Tarea no encontrada/i);
    });

    test("PUT /tareas/:id devuelve 400 si body inválido", async () => {
        const res = await app.inject({
            method: "PUT",
            url: "/tareas/uuid-tarea",
            payload: { nombre_tarea: "" }, // faltan campos obligatorios
        });

        expect(res.statusCode).toBe(400); // Zod debería responder 400
    });

    test("DELETE /tareas/:id devuelve 500 si hay error inesperado", async () => {
        eliminar.ejecutar.mockRejectedValue(new Error("DB caída"));

        const res = await app.inject({
            method: "DELETE",
            url: "/tareas/uuid-tarea",
        });

        expect(res.statusCode).toBe(500);
        expect(JSON.parse(res.body).mensaje).toMatch(/DB caída/i);
    });
});

import Fastify from "fastify";
import { proyectoRutas } from "../../../interfaces/rutas/proyectoRutas";
import { CrearProyecto } from "../../../aplicacion/casosUso/proyecto/CrearProyecto";
import { ListarProyectos } from "../../../aplicacion/casosUso/proyecto/ListarProyectos";
import { ObtenerProyectoPorId } from "../../../aplicacion/casosUso/proyecto/ObtenerProyectoPorId";
import { ActualizarProyecto } from "../../../aplicacion/casosUso/proyecto/ActualizarProyecto";
import { EliminarProyecto } from "../../../aplicacion/casosUso/proyecto/EliminarProyecto";

// Mocks de casos de uso
const crear = { ejecutar: jest.fn() };
const listar = { ejecutar: jest.fn() };
const obtenerPorId = { ejecutar: jest.fn() };
const actualizar = { ejecutar: jest.fn() };
const eliminar = { ejecutar: jest.fn() };

//app Fastify con las rutas registradas
function buildApp() {
    const app = Fastify();

    app.register(
        proyectoRutas(
            crear as unknown as CrearProyecto,
            listar as unknown as ListarProyectos,
            obtenerPorId as unknown as ObtenerProyectoPorId,
            actualizar as unknown as ActualizarProyecto,
            eliminar as unknown as EliminarProyecto
        ),
        { prefix: "/proyectos" }
    );

    return app;
}

describe("proyectoRutas integración", () => {
    let app: ReturnType<typeof buildApp>;

    beforeEach(() => {
        jest.clearAllMocks();
        app = buildApp();
    });

    test("POST /proyectos devuelve 201 al crear", async () => {
        const nuevoProyecto = {
            codigo_proyecto: "P-001",
            nombre_proyecto: "Backend API",
            fecha_inicio: "2025-11-01T00:00:00Z",
            fecha_fin: "2025-12-01T00:00:00Z",
            id_cliente: "uuid-cliente",
        };

        crear.ejecutar.mockResolvedValue({ id_proyecto: "uuid-proyecto", ...nuevoProyecto });

        const res = await app.inject({
            method: "POST",
            url: "/proyectos",
            payload: nuevoProyecto,
        });

        expect(res.statusCode).toBe(201);
        expect(JSON.parse(res.body).id_proyecto).toBe("uuid-proyecto");
    });

    test("GET /proyectos/:id devuelve 404 si no existe", async () => {
        obtenerPorId.ejecutar.mockResolvedValue(null);

        const res = await app.inject({
            method: "GET",
            url: "/proyectos/no-existe",
        });

        expect(res.statusCode).toBe(404);
        expect(JSON.parse(res.body).mensaje).toMatch(/Proyecto no encontrado/i);
    });

    test("PUT /proyectos/:id devuelve 400 si body inválido", async () => {
        const res = await app.inject({
            method: "PUT",
            url: "/proyectos/uuid-proyecto",
            payload: { nombre_proyecto: "" }, // faltan campos obligatorios
        });

        expect(res.statusCode).toBe(400); // Zod debería responder 400
    });

    test("DELETE /proyectos/:id devuelve 500 si hay error inesperado", async () => {
        eliminar.ejecutar.mockRejectedValue(new Error("DB caída"));

        const res = await app.inject({
            method: "DELETE",
            url: "/proyectos/uuid-proyecto",
        });

        expect(res.statusCode).toBe(500);
        expect(JSON.parse(res.body).mensaje).toMatch(/DB caída/i);
    });
});

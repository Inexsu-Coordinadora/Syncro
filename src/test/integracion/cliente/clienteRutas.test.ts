import Fastify from "fastify";
import { clienteRutas } from "../../../../src/interfaces/rutas/clienteRutas";
import { CrearCliente } from "../../../../src/aplicacion/casosUso/cliente/crearCliente";
import { ListarClientes } from "../../../../src/aplicacion/casosUso/cliente/ListarClientes";
import { ObtenerClientePorId } from "../../../../src/aplicacion/casosUso/cliente/ObtenerClientePorId";
import { ActualizarCliente } from "../../../../src/aplicacion/casosUso/cliente/ActualizarCliente";
import { EliminarCliente } from "../../../../src/aplicacion/casosUso/cliente/EliminarCliente";

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
    clienteRutas(
      crear as unknown as CrearCliente,
      listar as unknown as ListarClientes,
      obtenerPorId as unknown as ObtenerClientePorId,
      actualizar as unknown as ActualizarCliente,
      eliminar as unknown as EliminarCliente
    ),
    { prefix: "/clientes" }
  );

  return app;
}

describe("clienteRutas integración", () => {
  let app: ReturnType<typeof buildApp>;

  beforeEach(() => {
    // Reiniciar mocks entre tests
    jest.clearAllMocks();
    app = buildApp();
  });

  test("POST /clientes devuelve 201 al crear", async () => {
    const nuevoCliente = {
      nombre_cliente: "Maria",
      direccion_cliente: "Calle 1",
      email_cliente: "maria@test.com",
    };

    crear.ejecutar.mockResolvedValue({ id_cliente: "uuid-cliente", ...nuevoCliente });

    const res = await app.inject({
      method: "POST",
      url: "/clientes",
      payload: nuevoCliente,
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.id_cliente).toBe("uuid-cliente");
  });

  test("GET /clientes/:id devuelve 404 si no existe", async () => {
    obtenerPorId.ejecutar.mockResolvedValue(null);

    const res = await app.inject({
      method: "GET",
      url: "/clientes/no-existe",
    });

    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.body);
    expect(body.mensaje || body.message).toMatch(/Cliente no encontrado/i);
  });

  test("PUT /clientes/:id devuelve 400 si body inválido", async () => {
    // No mockeamos actualizar; esperamos que la validación falle antes
    const res = await app.inject({
      method: "PUT",
      url: "/clientes/uuid-cliente",
      payload: { nombre_cliente: "" }, // faltan campos obligatorios
    });

    expect(res.statusCode).toBe(400); // Zod debería responder 400
  });

  test("DELETE /clientes/:id devuelve 500 si hay error inesperado", async () => {
    eliminar.ejecutar.mockRejectedValue(new Error("DB caída"));

    const res = await app.inject({
      method: "DELETE",
      url: "/clientes/uuid-cliente",
    });

    expect(res.statusCode).toBe(500);
    const body = JSON.parse(res.body);
    // según tu manejador de errores puedes enviar 'mensaje' o 'message'
    expect((body.mensaje || body.message) as string).toMatch(/DB caída/i);
  });
});
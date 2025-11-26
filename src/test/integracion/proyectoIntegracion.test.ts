import supertest from "supertest";
import { crearServidorTest } from "../helpers/crearServidorTest";
import { proyectoRutas } from "../../interfaces/rutas/proyectoRutas";
import { CrearProyecto } from "../../aplicacion/casosUso/proyecto/CrearProyecto";
import { ListarProyectos } from "../../aplicacion/casosUso/proyecto/ListarProyectos";
import { ObtenerProyectoPorId } from "../../aplicacion/casosUso/proyecto/ObtenerProyectoPorId";
import { ActualizarProyecto } from "../../aplicacion/casosUso/proyecto/ActualizarProyecto";
import { EliminarProyecto } from "../../aplicacion/casosUso/proyecto/EliminarProyecto";
import { RepositorioProyectoPostgres } from "../../infraestructura/repositorios/repositorioProyectoPostgres";

describe("Integración - PROYECTOS", () => {
  let server: any;
  let repo: any;

  beforeEach(async () => {
    server = await crearServidorTest();
    repo = new RepositorioProyectoPostgres(server);

    await proyectoRutas(
      new CrearProyecto(repo),
      new ListarProyectos(repo),
      new ObtenerProyectoPorId(repo),
      new ActualizarProyecto(repo),
      new EliminarProyecto(repo)
    )(server);
    
    await server.ready();
  });

  afterEach(async () => {
    await server.close();
  });

  // GET /
  it("GET /proyectos debe retornar lista de proyectos", async () => {
    server.pg.connect = jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [{ idProyecto: 1 }] }),
      release: jest.fn(),
    });

    const res = await supertest(server.server).get("/");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  // GET /:id
  it("GET /:idProyecto debe retornar un proyecto existente", async () => {
    server.pg.connect = jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [{ idProyecto: 99 }] }),
      release: jest.fn(),
    });

    const res = await supertest(server.server).get("/99");
    
    expect(res.status).toBe(200);
    expect(res.body.idProyecto).toBe(99);
  });

  it("GET /:idProyecto debe retornar 404 si no existe", async () => {
    server.pg.connect = jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [] }),
      release: jest.fn(),
    });

    const res = await supertest(server.server).get("/999");
    expect(res.status).toBe(404);
  });

  // POST /
  it("POST / debe crear un proyecto", async () => {
    server.pg.connect = jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [{ idProyecto: 5 }] }),
      release: jest.fn(),
    });

    const res = await supertest(server.server)
      .post("/")
      .send({
        nombreProyecto: "Test",
        descripcionProyecto: "Demo",
        clienteId: 1,
        fecha_inicio: "2024-01-01",
        fecha_fin: "2024-02-01",
        estadoProyecto: "Planificado",
        consultor_asignado: null,
        roles_definidos: null
      });

    expect(res.status).toBe(201);
    expect(res.body.idProyecto).toBe(5);
  });

  it("POST / debe retornar 400 si estado != Planificado", async () => {
    const res = await supertest(server.server)
      .post("/")
      .send({
        nombreProyecto: "X",
        estadoProyecto: "Otro"
      });

    expect(res.status).toBe(400);
  });

  // PUT /
  it("PUT /:idProyecto debe actualizar un proyecto", async () => {
    server.pg.connect = jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [{ idProyecto: 1, nombreProyecto: "Nuevo" }] }),
      release: jest.fn(),
    });

    const res = await supertest(server.server)
      .put("/1")
      .send({ nombreProyecto: "Nuevo" });

    expect(res.status).toBe(200);
  });

  // DELETE /
  it("DELETE /:idProyecto debe eliminar un proyecto existente", async () => {
    server.pg.connect = jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [{ idProyecto: 1 }] }),
      release: jest.fn(),
    });

    const res = await supertest(server.server).delete("/1");
    expect(res.status).toBe(200);
  });

  it("DELETE /:idProyecto debe retornar 404 si no existe", async () => {
    server.pg.connect = jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [] }),
      release: jest.fn(),
    });

    const res = await supertest(server.server).delete("/999");
    expect(res.status).toBe(404);
  });
});

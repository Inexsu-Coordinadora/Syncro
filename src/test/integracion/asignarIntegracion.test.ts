import supertest from "supertest";
import { crearServidorTest } from "../helpers/crearServidorTest";
import { asignacionRutas } from "../../interfaces/rutas/asignacionRutas";
import { AsignarConsultorProyecto } from "../../aplicacion/casosUso/asignar_consultor/AsignarConsultorProyecto";
import { RepositorioAsignacionPG } from "../../infraestructura/repositorios/repositorioAsignacionPostgres";
import { RepositorioProyectoPostgres } from "../../infraestructura/repositorios/repositorioProyectoPostgres";
import { RepositorioConsultorPostgres } from "../../infraestructura/repositorios/repositorioConsultorPostgres";

describe("Integración - ASIGNACIÓN", () => {
  let server: any;

  beforeEach(async () => {
    server = await crearServidorTest();

    const repoProy = new RepositorioProyectoPostgres(server);
    const repoAsig = new RepositorioAsignacionPG(server);
    const repoCon = new RepositorioConsultorPostgres(server);

    await asignacionRutas(new AsignarConsultorProyecto(repoAsig, repoProy, repoCon))(server);
    await server.ready();
  });

  afterEach(async () => {
    await server.close();
  });

  const mockQuery = (rows: any[]) => ({
    query: jest.fn().mockResolvedValue({ rows }),
    release: jest.fn()
  });

  // CONSULTOR inexistente
  it("Debe retornar 404 si el consultor no existe", async () => {
    server.pg.connect = jest.fn()
      .mockResolvedValueOnce(mockQuery([{ idProyecto: 1 }])) 
      .mockResolvedValueOnce(mockQuery([])); 

    const res = await supertest(server.server).post("/").send({
      consultorId: 1,
      proyectoId: 1,
      fechaInicio: "2024-01-01",
      fechaFin: "2024-02-01",
      rolConsultor: "DEV",
      porcentajeDedicacion: 20
    });

    expect(res.status).toBe(404);
  });

  // PROYECTO inexistente
  it("Debe retornar 404 si el proyecto no existe", async () => {
    server.pg.connect = jest.fn()
      .mockResolvedValueOnce(mockQuery([])) 
      .mockResolvedValueOnce(mockQuery([{ idConsultor: 1 }])); 

    const res = await supertest(server.server).post("/").send({
      consultorId: 1,
      proyectoId: 99,
      fechaInicio: "2024-01-01",
      fechaFin: "2024-02-01",
      rolConsultor: "DEV",
      porcentajeDedicacion: 20
    });

    expect(res.status).toBe(404);
  });

  // Fechas inválidas
  it("Debe retornar 400 si fecha fin < fecha inicio", async () => {
    server.pg.connect = jest.fn()
      .mockResolvedValue(mockQuery([{ idProyecto: 1 }]));

    const res = await supertest(server.server).post("/").send({
      consultorId: 1,
      proyectoId: 1,
      fechaInicio: "2024-05-01",
      fechaFin: "2024-04-01",
      rolConsultor: "DEV",
      porcentajeDedicacion: 30
    });

    expect(res.status).toBe(400);
  });

  // Asignación duplicada
  it("Debe retornar 400 si existe asignación duplicada", async () => {
    server.pg.connect = jest.fn()
      .mockResolvedValueOnce(mockQuery([{ idProyecto: 1 }])) 
      .mockResolvedValueOnce(mockQuery([{ idConsultor: 1 }])) 
      .mockResolvedValueOnce(mockQuery([{ a: 1 }])); 

    const res = await supertest(server.server).post("/").send({
      consultorId: 1,
      proyectoId: 1,
      fechaInicio: "2024-01-01",
      fechaFin: "2024-02-01",
      rolConsultor: "DEV",
      porcentajeDedicacion: 20
    });

    expect(res.status).toBe(400);
  });

  // Exceso dedicación
  it("Debe retornar 400 si la dedicación supera 100%", async () => {
    server.pg.connect = jest.fn()
      .mockResolvedValueOnce(mockQuery([{ idProyecto: 1 }])) 
      .mockResolvedValueOnce(mockQuery([{ idConsultor: 1 }])) 
      .mockResolvedValueOnce(mockQuery([]))                
      .mockResolvedValueOnce(mockQuery([
        { porcentajeDedicacion: 80 },
        { porcentajeDedicacion: 30 }
      ]));

    const res = await supertest(server.server).post("/").send({
      consultorId: 1,
      proyectoId: 1,
      fechaInicio: "2024-01-01",
      fechaFin: "2024-02-01",
      rolConsultor: "DEV",
      porcentajeDedicacion: 20
    });

    expect(res.status).toBe(400);
  });

  // Caso ÉXITO
  it("Debe crear una asignación válida", async () => {
    server.pg.connect = jest.fn()
      .mockResolvedValueOnce(mockQuery([{ idProyecto: 1 }]))
      .mockResolvedValueOnce(mockQuery([{ idConsultor: 1 }]))
      .mockResolvedValueOnce(mockQuery([]))
      .mockResolvedValueOnce(mockQuery([{ porcentajeDedicacion: 20 }]))
      .mockResolvedValueOnce(mockQuery([{ idAsignacion: 99 }]));

    const res = await supertest(server.server).post("/").send({
      consultorId: 1,
      proyectoId: 1,
      fechaInicio: "2024-01-01",
      fechaFin: "2024-02-01",
      rolConsultor: "DEV",
      porcentajeDedicacion: 20
    });

    expect(res.status).toBe(201);
    expect(res.body.idAsignacion).toBe(99);
  });
});

import { AsignarConsultorProyecto } from "../../../aplicacion/casosUso/asignar_consultor/AsignarConsultorProyecto";
import { IAsignacion } from "../../../dominio/entidades/IAsignacion";

describe("AsignarConsultorProyecto - Pruebas unitarias", () => {

  let mockRepoAsignacion: any;
  let mockRepoProyecto: any;
  let mockRepoConsultor: any;
  let casoUso: AsignarConsultorProyecto;

  beforeEach(() => {
    mockRepoAsignacion = {
      verificarAsignacionDuplicada: jest.fn(),
      obtenerAsignacionesSuperpuestas: jest.fn(),
      crearAsignacion: jest.fn()
    };

    mockRepoProyecto = {
      obtenerProyectoPorId: jest.fn()
    };

    mockRepoConsultor = {
      obtenerConsultorPorId: jest.fn()
    };

    casoUso = new AsignarConsultorProyecto(
      mockRepoAsignacion,
      mockRepoProyecto,
      mockRepoConsultor
    );
  });

  const datosBase: IAsignacion = {
    consultorId: "1",
    proyectoId: "10",
    fechaInicio: new Date("2024-01-10"),
    fechaFin: new Date("2024-02-20"),
    rolConsultor: "DEV",
    porcentajeDedicacion: 30
  };


  // 1. Proyecto y consultor deben existir
  it("Debe lanzar error si el proyecto no existe", async () => {
    mockRepoProyecto.obtenerProyectoPorId.mockResolvedValue(null);
    mockRepoConsultor.obtenerConsultorPorId.mockResolvedValue({ id: 1 });

    await expect(casoUso.ejecutar(datosBase))
      .rejects
      .toThrow("Proyecto 10 inexistente.");
  });

  it("Debe lanzar error si el consultor no existe", async () => {
    mockRepoProyecto.obtenerProyectoPorId.mockResolvedValue({ id: 10 });
    mockRepoConsultor.obtenerConsultorPorId.mockResolvedValue(null);

    await expect(casoUso.ejecutar(datosBase))
      .rejects
      .toThrow("Consultor 1 inexistente.");
  });

  // 2. Validación de fechas
  it("Debe lanzar error si la fecha fin es anterior a la fecha inicio", async () => {

    const datosInvalidos = {
      ...datosBase,
      fechaInicio: new Date("2024-05-01"),
      fechaFin: new Date("2024-04-01")
    };

    mockRepoProyecto.obtenerProyectoPorId.mockResolvedValue({ id: 10 });
    mockRepoConsultor.obtenerConsultorPorId.mockResolvedValue({ id: 1 });

    await expect(casoUso.ejecutar(datosInvalidos))
      .rejects
      .toThrow("Fechas inválidas (fin no puede ser anterior a inicio).");
  });

  // 3. Duplicados
  it("Debe lanzar error si existe una asignación duplicada", async () => {
    mockRepoProyecto.obtenerProyectoPorId.mockResolvedValue({ id: 10 });
    mockRepoConsultor.obtenerConsultorPorId.mockResolvedValue({ id: 1 });

    mockRepoAsignacion.verificarAsignacionDuplicada.mockResolvedValue(true);

    await expect(casoUso.ejecutar(datosBase))
      .rejects
      .toThrow("Asignación duplicada (consultor/proyecto/rol) ya registrada.");
  });

  // 4. Validación: exceso de dedicación (>100%)
  it("Debe lanzar error si la dedicación supera el 100%", async () => {

    mockRepoProyecto.obtenerProyectoPorId.mockResolvedValue({ id: 10 });
    mockRepoConsultor.obtenerConsultorPorId.mockResolvedValue({ id: 1 });

    mockRepoAsignacion.verificarAsignacionDuplicada.mockResolvedValue(false);

    mockRepoAsignacion.obtenerAsignacionesSuperpuestas.mockResolvedValue([
      { porcentajeDedicacion: 60 },
      { porcentajeDedicacion: 30 }
    ]);

    await expect(casoUso.ejecutar(datosBase))
      .rejects
      .toThrow(/Exceso de dedicación/);
  });

  // 5. Caso de éxito
  it("Debe crear una asignación válida", async () => {

    mockRepoProyecto.obtenerProyectoPorId.mockResolvedValue({ id: 10 });
    mockRepoConsultor.obtenerConsultorPorId.mockResolvedValue({ id: 1 });

    mockRepoAsignacion.verificarAsignacionDuplicada.mockResolvedValue(false);
    mockRepoAsignacion.obtenerAsignacionesSuperpuestas.mockResolvedValue([
      { porcentajeDedicacion: 20 }
    ]);

    mockRepoAsignacion.crearAsignacion.mockResolvedValue({
      ...datosBase,
      id: 999
    });

    const resultado = await casoUso.ejecutar(datosBase);

    expect(resultado.idAsignacion).toBe(999);
    expect(mockRepoAsignacion.crearAsignacion).toHaveBeenCalledTimes(1);
  });
});
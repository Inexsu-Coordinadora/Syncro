import { CrearProyecto } from "../../../aplicacion/casosUso/proyecto/CrearProyecto";
import { ActualizarProyecto } from "../../../aplicacion/casosUso/proyecto/ActualizarProyecto";
import { EliminarProyecto } from "../../../aplicacion/casosUso/proyecto/EliminarProyecto";
import { ListarProyectos } from "../../../aplicacion/casosUso/proyecto/ListarProyectos";
import { ObtenerProyectoPorId } from "../../../aplicacion/casosUso/proyecto/ObtenerProyectoPorId";
import { NotFoundError } from "../../../aplicacion/errors/NotFoundError";
import { IProyecto } from "../../../dominio/entidades/IProyecto";

describe("Casos de Uso - Proyecto", () => {
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      crearProyecto: jest.fn(),
      actualizarProyecto: jest.fn(),
      eliminarProyecto: jest.fn(),
      listarProyectos: jest.fn(),
      obtenerProyectoPorId: jest.fn(),
    };
  });


  // CREAR PROYECTO

  describe("CrearProyecto", () => {
    const casoUso = () => new CrearProyecto(mockRepo);

    const proyectoValido: IProyecto = {
      idProyecto: "1",
      nombreProyecto: "Proyecto A",
      descripcionProyecto: "Descripción",
      fechaInicio: new Date(),
      fechaFin: new Date(),
      estadoProyecto: "Planificado",
      clienteId: "cliente-1",
      consultorAsignado: "consultor-1",
      rolesDefinidos: "rol1",
    };

    it("Debe crear un proyecto con estado 'Planificado'", async () => {
      mockRepo.crearProyecto.mockResolvedValue(proyectoValido);

      const resultado = await casoUso().ejecutar(proyectoValido);

      expect(resultado).toEqual(proyectoValido);
      expect(mockRepo.crearProyecto).toHaveBeenCalledTimes(1);
    });

    it("Debe lanzar error si el estado inicial no es 'Planificado'", async () => {
      const proyectoInvalido = { ...proyectoValido, estadoProyecto: "En progreso" };

      await expect(casoUso().ejecutar(proyectoInvalido as IProyecto))
        .rejects
        .toThrow("El estado inicial debe ser Planificado.");
    });
  });


  // ACTUALIZAR PROYECTO

  describe("ActualizarProyecto", () => {
    const casoUso = () => new ActualizarProyecto(mockRepo);

    it("Debe actualizar un proyecto existente", async () => {
      const datos = { nombreProyecto: "Nuevo Nombre" };
      const proyectoActualizado = { id: "1", ...datos };

      mockRepo.actualizarProyecto.mockResolvedValue(proyectoActualizado);

      const resultado = await casoUso().ejecutar("1", datos);

      expect(resultado).toEqual(proyectoActualizado);
      expect(mockRepo.actualizarProyecto).toHaveBeenCalledTimes(1);
    });

    it("Debe lanzar error si el proyecto no existe", async () => {
      mockRepo.actualizarProyecto.mockResolvedValue(null);

      await expect(casoUso().ejecutar("999", { nombreProyecto: "X" }))
        .rejects
        .toThrow(NotFoundError);
    });
  });


  // ELIMINAR PROYECTO

  describe("EliminarProyecto", () => {
    const casoUso = () => new EliminarProyecto(mockRepo);

    it("Debe eliminar un proyecto existente", async () => {
      mockRepo.eliminarProyecto.mockResolvedValue(true);

      const msg = await casoUso().ejecutar("1");

      expect(msg).toBe("Proyecto 1 eliminado con éxito.");
      expect(mockRepo.eliminarProyecto).toHaveBeenCalledTimes(1);
    });

    it("Debe lanzar error si el proyecto no existe", async () => {
      mockRepo.eliminarProyecto.mockResolvedValue(false);

      await expect(casoUso().ejecutar("123"))
        .rejects
        .toThrow(NotFoundError);
    });
  });


  // LISTAR PROYECTOS

  describe("ListarProyectos", () => {
    const casoUso = () => new ListarProyectos(mockRepo);

    it("Debe retornar lista de proyectos", async () => {
      const lista = [{ id: "1" }, { id: "2" }];

      mockRepo.listarProyectos.mockResolvedValue(lista);

      const resultado = await casoUso().ejecutar();

      expect(resultado).toEqual(lista);
      expect(mockRepo.listarProyectos).toHaveBeenCalledTimes(1);
    });
  });


  // OBTENER PROYECTO POR ID

  describe("ObtenerProyectoPorId", () => {
    const casoUso = () => new ObtenerProyectoPorId(mockRepo);

    it("Debe retornar un proyecto válido", async () => {
      const proyecto = { id: "1", nombreProyecto: "Test" };
      mockRepo.obtenerProyectoPorId.mockResolvedValue(proyecto);

      const resultado = await casoUso().ejecutar("1");

      expect(resultado).toEqual(proyecto);
      expect(mockRepo.obtenerProyectoPorId).toHaveBeenCalledTimes(1);
    });

    it("Debe lanzar error si el proyecto no existe", async () => {
      mockRepo.obtenerProyectoPorId.mockResolvedValue(null);

      await expect(casoUso().ejecutar("999"))
        .rejects
        .toThrow(NotFoundError);
    });
  });
});

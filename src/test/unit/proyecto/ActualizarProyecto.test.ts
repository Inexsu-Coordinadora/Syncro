import { ActualizarProyecto } from "../../../../src/aplicacion/casosUso/proyecto/ActualizarProyecto";
import { NotFoundError } from "../../../../src/aplicacion/errors/NotFoundError";
import { ValidationError } from "../../../../src/aplicacion/errors/ValidationError";
import { IProyecto } from "../../../../src/dominio/entidades/IProyecto";

describe("ActualizarProyecto (unit)", () => {
    const repoMock = {
        actualizarProyecto: jest.fn(),
    };

    const casoUso = new ActualizarProyecto(repoMock as any);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("lanza ValidationError si faltan campos obligatorios", async () => {
        const proyectoInvalido = {
            codigo_proyecto: "",
            nombre_proyecto: "",
            descripcion_proyecto: "",
            fecha_inicio: "",
            fecha_fin: "",
            estado: "",
            id_cliente: "",
        } as IProyecto;

        await expect(casoUso.ejecutar("id123", proyectoInvalido))
            .rejects.toThrow(ValidationError);
    });

    test("lanza NotFoundError si el proyecto no existe", async () => {
        const proyectoValido: IProyecto = {
            codigo_proyecto: "P-001",
            nombre_proyecto: "API Backend",
            descripcion_proyecto: "Proyecto para exponer endpoints",
            fecha_inicio: "2025-11-01T00:00:00Z",
            fecha_fin: "2025-12-01T00:00:00Z",
            estado: "activo",
            id_cliente: "uuid-cliente",
        };

        repoMock.actualizarProyecto.mockResolvedValue(null);

        await expect(casoUso.ejecutar("id123", proyectoValido))
            .rejects.toThrow(NotFoundError);
    });

    test("retorna proyecto actualizado si existe", async () => {
        const proyectoValido: IProyecto = {
            codigo_proyecto: "P-001",
            nombre_proyecto: "API Backend",
            descripcion_proyecto: "Proyecto para exponer endpoints",
            fecha_inicio: "2025-11-01T00:00:00Z",
            fecha_fin: "2025-12-01T00:00:00Z",
            estado: "activo",
            id_cliente: "uuid-cliente",
        };

        repoMock.actualizarProyecto.mockResolvedValue(proyectoValido);

        const result = await casoUso.ejecutar("id123", proyectoValido);

        expect(result).toEqual(proyectoValido);
        expect(repoMock.actualizarProyecto).toHaveBeenCalledWith("id123", proyectoValido);
    });
});

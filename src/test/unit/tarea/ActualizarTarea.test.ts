import { ActualizarTarea } from "../../../../src/aplicacion/casosUso/tarea/ActualizarTarea";
import { NotFoundError } from "../../../../src/aplicacion/errors/NotFoundError";
import { ValidationError } from "../../../../src/aplicacion/errors/ValidationError";
import { ITarea } from "../../../../src/dominio/entidades/ITarea";

describe("ActualizarTarea (unit)", () => {
    const repoMock = {
        actualizarTarea: jest.fn(),
    };

    const casoUso = new ActualizarTarea(repoMock as any);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("lanza ValidationError si faltan campos obligatorios", async () => {
        const tareaInvalida = {
            codigo_tarea: "",
            nombre_tarea: "",
            estado: "", 
            fecha_limite: "",
            id_proyecto: "",
        } as unknown as ITarea; 

        await expect(casoUso.ejecutar("id123", tareaInvalida))
            .rejects.toThrow(ValidationError);
    });

    test("lanza NotFoundError si la tarea no existe", async () => {
        const tareaValida: ITarea = {
            codigo_tarea: "T-001",
            nombre_tarea: "Implementar validación",
            estado: "pendiente",
            fecha_limite: "2025-12-01T00:00:00Z",
            id_proyecto: "uuid-proyecto",
        };

        repoMock.actualizarTarea.mockResolvedValue(null);

        await expect(casoUso.ejecutar("id123", tareaValida))
            .rejects.toThrow(NotFoundError);
    });

    test("retorna tarea actualizada si existe", async () => {
        const tareaValida: ITarea = {
            codigo_tarea: "T-001",
            nombre_tarea: "Implementar validación",
            estado: "pendiente",
            fecha_limite: "2025-12-01T00:00:00Z",
            id_proyecto: "uuid-proyecto",
        };

        repoMock.actualizarTarea.mockResolvedValue(tareaValida);

        const result = await casoUso.ejecutar("id123", tareaValida);

        expect(result).toEqual(tareaValida);
        expect(repoMock.actualizarTarea).toHaveBeenCalledWith("id123", tareaValida);
    });
});

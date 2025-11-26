import { ActualizarCliente } from "../../../../src/aplicacion/casosUso/cliente/ActualizarCliente";
import { NotFoundError } from "../../../../src/aplicacion/errors/NotFoundError";
import { ValidationError } from "../../../../src/aplicacion/errors/ValidationError";
import { ICliente } from "../../../../src/dominio/entidades/ICliente";

describe("ActualizarCliente (unit)", () => {
    const repoMock = {
        actualizarCliente: jest.fn(),
    };

    const casoUso = new ActualizarCliente(repoMock as any);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("lanza ValidationError si faltan campos obligatorios", async () => {
        const clienteInvalido = {
            nombre_cliente: "",
            direccion_cliente: "",
            email_cliente: "",
        } as ICliente;

        await expect(casoUso.ejecutar("id123", clienteInvalido))
            .rejects.toThrow(ValidationError);
    });

    test("lanza NotFoundError si el cliente no existe", async () => {
        const clienteValido = {
            nombre_cliente: "Maria",
            direccion_cliente: "Calle 1",
            email_cliente: "maria@test.com",
        } as ICliente;

        repoMock.actualizarCliente.mockResolvedValue(null);

        await expect(casoUso.ejecutar("id123", clienteValido))
            .rejects.toThrow(NotFoundError);
    });

    test("retorna cliente actualizado si existe", async () => {
        const clienteValido = {
            nombre_cliente: "Maria",
            direccion_cliente: "Calle 1",
            email_cliente: "maria@test.com",
        } as ICliente;

        repoMock.actualizarCliente.mockResolvedValue(clienteValido);

        const result = await casoUso.ejecutar("id123", clienteValido);

        expect(result).toEqual(clienteValido);
        expect(repoMock.actualizarCliente).toHaveBeenCalledWith("id123", clienteValido);
    });
});

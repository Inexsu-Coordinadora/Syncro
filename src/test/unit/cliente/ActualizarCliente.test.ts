import { ActualizarCliente } from '../../../aplicacion/casosUso/cliente/ActualizarCliente';
import { ICliente } from '../../../dominio/entidades/ICliente';
import { IRepositorioCliente } from '../../../dominio/repositorio/IRepositorioCliente';
import { NotFoundError } from '../../../aplicacion/errors/NotFoundError';
import { ValidationError } from '../../../aplicacion/errors/ValidationError';

// Creamos un objeto mock que implementa la interfaz IRepositorioCliente
const mockRepositorioCliente:IRepositorioCliente = {
    crearCliente: jest.fn(),
    obtenerClientePorId: jest.fn(),
    actualizarCliente: jest.fn(),
    eliminarCliente: jest.fn(),
    listarClientes: jest.fn(),
    consultarProyectosPorCliente: jest.fn(),
};

// Datos de prueba
const idClienteValido = "123e4567-e89b-12d3-a456-426614174000";
const idClienteNoExistente = "999e4567-e89b-12d3-a456-426614174000";
const datosClienteValidos: ICliente = {
    nombre_cliente: "Nuevo Nombre",
    direccion_cliente: "Nueva Dirección",
    email_cliente: "nuevo@ejemplo.com",
};
const clienteActualizado: ICliente = {
    id_cliente: idClienteValido,
    ...datosClienteValidos,
};


describe('ActualizarCliente', () => {
    let actualizarCliente: ActualizarCliente;


    beforeEach(() => {
        jest.clearAllMocks(); 
        
        actualizarCliente = new ActualizarCliente(mockRepositorioCliente);
    });

    test('debe actualizar un cliente y retornar el cliente actualizado', async () => {
        // Mock: Simular que el repositorio retorna el cliente actualizado
        mockRepositorioCliente.actualizarCliente = jest.fn().mockResolvedValue(clienteActualizado);

        const resultado = await actualizarCliente.ejecutar(idClienteValido, datosClienteValidos);

        expect(mockRepositorioCliente.actualizarCliente).toHaveBeenCalledWith(idClienteValido, datosClienteValidos);
        expect(resultado).toEqual(clienteActualizado);
    });

    // --- PRUEBAS DE VALIDACIÓN Y ERRORES ---

    test('debe lanzar ValidationError si el ID del cliente es nulo o vacío', async () => {
        // ID vacío
        await expect(actualizarCliente.ejecutar("", datosClienteValidos)).rejects.toThrow(ValidationError);
        await expect(actualizarCliente.ejecutar("", datosClienteValidos)).rejects.toThrow("El ID del cliente es obligatorio para la actualización.");

        // ID nulo
        await expect(actualizarCliente.ejecutar(null as any, datosClienteValidos)).rejects.toThrow(ValidationError);
    });

    test('debe lanzar ValidationError si falta el nombre_cliente', async () => {
        const datosInvalidos: ICliente = { ...datosClienteValidos, nombre_cliente: "" };

        await expect(actualizarCliente.ejecutar(idClienteValido, datosInvalidos)).rejects.toThrow(ValidationError);
        await expect(actualizarCliente.ejecutar(idClienteValido, datosInvalidos)).rejects.toThrow("Los campos nombre_cliente, direccion_cliente y email_cliente son obligatorios.");
    });
    
    test('debe lanzar ValidationError si falta la direccion_cliente', async () => {
        const datosInvalidos: ICliente = { 
            nombre_cliente: "Nombre", 
            email_cliente: "a@b.com", 
            direccion_cliente: "" 
        };

        await expect(actualizarCliente.ejecutar(idClienteValido, datosInvalidos)).rejects.toThrow(ValidationError);
    });

    test('debe lanzar ValidationError si falta el email_cliente', async () => {
        const datosInvalidos: ICliente = { ...datosClienteValidos, email_cliente: "" };

        await expect(actualizarCliente.ejecutar(idClienteValido, datosInvalidos)).rejects.toThrow(ValidationError);
        await expect(actualizarCliente.ejecutar(idClienteValido, datosInvalidos)).rejects.toThrow("Los campos nombre_cliente, direccion_cliente y email_cliente son obligatorios.");
    });
    
    test('debe lanzar NotFoundError si el cliente no es encontrado por el repositorio', async () => {
        // Mock: Simular que el repositorio no encontró el cliente (retorna null o undefined)
        mockRepositorioCliente.actualizarCliente = jest.fn().mockResolvedValue(null);

        await expect(actualizarCliente.ejecutar(idClienteNoExistente, datosClienteValidos)).rejects.toThrow(NotFoundError);
        await expect(actualizarCliente.ejecutar(idClienteNoExistente, datosClienteValidos)).rejects.toThrow(`Cliente con ID ${idClienteNoExistente} no encontrado.`);
        
        // método del repositorio fue llamado
        expect(mockRepositorioCliente.actualizarCliente).toHaveBeenCalled();
    });
});
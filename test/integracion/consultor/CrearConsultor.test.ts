import { CrearConsultor } from '../../../src/aplicacion/casosUso/consultor/CrearConsultor';
import { IRepositorioConsultor } from '../../../src/dominio/repositorio/IRepositorioConsultor';
import { IConsultor } from '../../../src/dominio/entidades/IConsultor';

describe('CrearConsultor - Caso de Uso', () => {
  let mockRepositorio: jest.Mocked<IRepositorioConsultor>;
  let crearConsultor: CrearConsultor;

  beforeEach(() => {
    mockRepositorio = {
      crear: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
      obtenerPorId: jest.fn(),
      listar: jest.fn(),
      existeEmail: jest.fn(),
    };

    crearConsultor = new CrearConsultor(mockRepositorio);
  });

  it('Debe crear un consultor exitosamente', async () => {
    const datosConsultor: Omit<IConsultor, 'idConsultor'> = {
      nombre: 'Samuel Cortazar',
      emailConsultor: 'samuel@example.com',
      telefono: '+57 123 456 7890',
      especialidad: 'backend'
    };

    const consultorCreado: IConsultor = {
      idConsultor: '1',
      ...datosConsultor,
    };

    mockRepositorio.existeEmail.mockResolvedValue(false);
    mockRepositorio.crear.mockResolvedValue(consultorCreado);

    const resultado = await crearConsultor.ejecutar(datosConsultor);

    expect(mockRepositorio.existeEmail).toHaveBeenCalledWith(datosConsultor.emailConsultor);
    expect(mockRepositorio.crear).toHaveBeenCalled();
    expect(resultado).toEqual(consultorCreado);
  });

  it('Debe lanzar error si el nombre está vacío', async () => {
    const datosConsultor: Omit<IConsultor, 'idConsultor'> = {
      nombre: '',
      emailConsultor: 'samuel@example.com',
      telefono: '+57 123 456 7890',
      especialidad: 'backend'
    };

    await expect(crearConsultor.ejecutar(datosConsultor)).rejects.toThrow('El nombre es obligatorio');
  });

  it('Debe lanzar error si el email es inválido', async () => {
    const datosConsultor: Omit<IConsultor, 'idConsultor'> = {
      nombre: 'Samuel Cortazar',
      emailConsultor: 'email-invalido',
      telefono: '+57 123 456 7890',
      especialidad: 'backend'
    };

    await expect(crearConsultor.ejecutar(datosConsultor)).rejects.toThrow('El email es inválido');
  });

  it('Debe lanzar error si la especialidad está vacía', async () => {
    const datosConsultor: Omit<IConsultor, 'idConsultor'> = {
      nombre: 'Samuel Cortazar',
      emailConsultor: 'samuel@example.com',
      telefono: '+57 123 456 7890',
      especialidad: ''
    };

    await expect(crearConsultor.ejecutar(datosConsultor)).rejects.toThrow('La especialidad es obligatoria');
  });

  it('Debe lanzar error si el email ya existe', async () => {
    const datosConsultor: Omit<IConsultor, 'idConsultor'> = {
      nombre: 'Samuel Cortazar',
      emailConsultor: 'samuel@example.com',
      telefono: '+57 123 456 7890',
      especialidad: 'backend'
    };

    mockRepositorio.existeEmail.mockResolvedValue(true);

    await expect(crearConsultor.ejecutar(datosConsultor)).rejects.toThrow('El email ya está registrado');
  });
});
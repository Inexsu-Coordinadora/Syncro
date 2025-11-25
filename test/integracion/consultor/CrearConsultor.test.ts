import { CrearConsultor } from '../../../src/aplicacion/casosUso/consultor/CrearConsultor';
import { IRepositorioConsultor } from '../../../src/dominio/repositorio/IRepositorioConsultor';
import { IConsultor } from '../../../src/dominio/entidades/IConsultor';

describe('CrearConsultor - Pruebas Unitarias', () => {
  let crearConsultor: CrearConsultor;
  let mockRepositorio: jest.Mocked<IRepositorioConsultor>;

  beforeEach(() => {
    mockRepositorio = {
      crear: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
      obtenerPorId: jest.fn(),
      obtener: jest.fn(),
      listar: jest.fn(),
      existeEmail: jest.fn()
    } as jest.Mocked<IRepositorioConsultor>;

    crearConsultor = new CrearConsultor(mockRepositorio);
  });

  test('Debe crear un consultor con datos válidos', async () => {

    const datosConsultor: Omit<IConsultor, 'idConsultor'> = {
      nombreConsultor: 'Samuel Cortazar',
      emailConsultor: 'elproximosuckerberg@gmail.com',
      telefonoConsultor: '+57 123 4567 8900',
      especialidadConsultor: 'Backend'
    };

    const consultorEsperado: IConsultor = {
      idConsultor: 1,
      nombreConsultor: 'Samuel Cortazar',
      emailConsultor: 'elproximosuckerberg@gmail.com',
      telefonoConsultor: '+57 123 4567 8900',
      especialidadConsultor: 'Backend'
    };

    mockRepositorio.existeEmail.mockResolvedValue(false);
    mockRepositorio.crear.mockResolvedValue(consultorEsperado);

    const resultado = await crearConsultor.ejecutar(datosConsultor);

    expect(resultado).toEqual(consultorEsperado);
    expect(mockRepositorio.existeEmail).toHaveBeenCalledWith(datosConsultor.emailConsultor);
    expect(mockRepositorio.crear).toHaveBeenCalledWith(datosConsultor);
  });

  test('Debe rechazar email duplicado', async () => {
    const datosConsultor: Omit<IConsultor, 'idConsultor'> = {
      nombreConsultor: 'Samuel Cortazar',
      emailConsultor: 'elproximosuckerberg@gmail.com',
      telefonoConsultor: '+57 123 4567 8900',
      especialidadConsultor: 'Backend'
    };

    mockRepositorio.existeEmail.mockResolvedValue(true);

    await expect(crearConsultor.ejecutar(datosConsultor))
      .rejects
      .toThrow('El email ya está registrado');
    
    expect(mockRepositorio.crear).not.toHaveBeenCalled();
  });

  test('Debe rechazar datos incompletos - nombre vacío', async () => {
    const datosInvalidos: Omit<IConsultor, 'idConsultor'> = {
      nombreConsultor: 'Samuel Cortazar',
      emailConsultor: 'elproximosuckerberg@gmail.com',
      telefonoConsultor: '+57 123 4567 8900',
      especialidadConsultor: 'Backend'
    };

    await expect(crearConsultor.ejecutar(datosInvalidos))
      .rejects
      .toThrow('El nombre es obligatorio');
  });

  test('Debe rechazar email inválido', async () => {
    
    const datosInvalidos: Omit<IConsultor, 'idConsultor'> = {
      nombreConsultor: 'Samuel Cortazar',
      emailConsultor: 'elproximosuckerberg@gmail.com',
      telefonoConsultor: '+57 123 4567 8900',
      especialidadConsultor: 'Backend'
    };

    await expect(crearConsultor.ejecutar(datosInvalidos))
      .rejects
      .toThrow('Email inválido');
  });
});
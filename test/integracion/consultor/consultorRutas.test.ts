import { crearServidorBase } from '../../../src/interfaces/rutas/servidor'; 
import { FastifyInstance } from 'fastify';

describe('Consultor Routes - Pruebas de Integración', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = crearServidorBase({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/consultores', () => {
    test('Debe crear un consultor exitosamente', async () => {
      const nuevoConsultor = {
        nombre: 'Samuel Cortazar',
        emailConsultor: `samuel${Date.now()}@gmail.com`,
        telefono: '+57 123 456 7890',
        especialidad: 'backend'
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/consultores',
        payload: nuevoConsultor
      });

      if (response.statusCode !== 201) {
        console.log('Error response:', response.json());
        console.log('Status:', response.statusCode);
console.log('Body completo:', response.body);
      }

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body).toHaveProperty('idConsultor');
      expect(body.nombre).toBe(nuevoConsultor.nombre);
      expect(body.emailConsultor).toBe(nuevoConsultor.emailConsultor);
      expect(body.telefono).toBe(nuevoConsultor.telefono);
      expect(body.especialidad).toBe(nuevoConsultor.especialidad);
    });

    test('Debe retornar 400 con datos inválidos', async () => {
      const datosInvalidos = {
        nombre: '',
        emailConsultor: `invalido${Date.now()}`,
        telefono: '+57 123 456 7890',
        especialidad: 'backend',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/consultores',
        payload: datosInvalidos
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toHaveProperty('error');
    });

    test('Debe retornar 409 con email duplicado', async () => {
      const emailUnico = `juanpablo${Date.now()}@gmail.com`;
      const consultor = {
        nombre: 'Juan Pablo',
        emailConsultor: emailUnico,
        telefono: '+57 123 456 7890',
        especialidad: 'backend'
      };

      const firstResponse = await app.inject({
        method: 'POST',
        url: '/api/consultores',
        payload: consultor
      });

      expect(firstResponse.statusCode).toBe(201);

      const response = await app.inject({
        method: 'POST',
        url: '/api/consultores',
        payload: consultor
      });

      expect(response.statusCode).toBe(409);
      const body = response.json();
      expect(body).toHaveProperty('error');
    });
  });

  describe('GET /api/consultores', () => {
    test('Debe retornar lista de consultores', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/consultores'
      });

      if (response.statusCode !== 200) {
        console.log('Error response:', response.json());
      }

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(Array.isArray(body)).toBe(true);
    });
  });

  describe('GET /api/consultores/:id', () => {
    test('Debe retornar un consultor por ID', async () => {
      const nuevoConsultor = {
        nombre: 'Maria Paula',
        emailConsultor: `mariapaula${Date.now()}@gmail.com`,
        telefono: '+57 123 456 7811',
        especialidad: 'backend'
      };

      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/consultores',
        payload: nuevoConsultor
      });

      expect(createResponse.statusCode).toBe(201);
      const consultorId = createResponse.json().idConsultor; 

      const response = await app.inject({
        method: 'GET',
        url: `/api/consultores/${consultorId}`
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.idConsultor).toBe(consultorId);
      expect(body.nombre).toBe(nuevoConsultor.nombre);
    });

    test('Debe retornar 404 con ID inexistente', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/consultores/99999'
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toHaveProperty('error');
    });
  });

  describe('PUT /api/consultores/:id', () => {
    test('Debe actualizar un consultor', async () => {
      const nuevoConsultor = {
        nombre: 'Veronica Torres',
        emailConsultor: `veronica${Date.now()}@gmail.com`,
        telefono: '+57 300 3333333',
        especialidad: 'redes sociales'
      };

      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/consultores',
        payload: nuevoConsultor
      });

      expect(createResponse.statusCode).toBe(201);
      const consultorId = createResponse.json().idConsultor; 

      const datosActualizados = {
        nombre: 'Veronica Torres Actualizada',
        especialidad: 'Full Stack'
      };

      const response = await app.inject({
        method: 'PUT',
        url: `/api/consultores/${consultorId}`,
        payload: datosActualizados
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.nombre).toBe(datosActualizados.nombre);
      expect(body.especialidad).toBe(datosActualizados.especialidad);
    });

    test('Debe retornar 404 al actualizar consultor inexistente', async () => {
      const datosActualizados = {
        nombre: 'Nombre Actualizado'
      };

      const response = await app.inject({
        method: 'PUT',
        url: '/api/consultores/99999',
        payload: datosActualizados
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/consultores/:id', () => {
    test('Debe eliminar un consultor', async () => {
      const nuevoConsultor = {
        nombre: 'Consultor a Eliminar',
        emailConsultor: `eliminar${Date.now()}@gmail.com`,
        telefono: '+57 300 3333333',
        especialidad: 'testing'
      };

      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/consultores',
        payload: nuevoConsultor
      });

      expect(createResponse.statusCode).toBe(201);
      const consultorId = createResponse.json().idConsultor; 

      const response = await app.inject({
        method: 'DELETE',
        url: `/api/consultores/${consultorId}`
      });

      expect(response.statusCode).toBe(204);

      const getResponse = await app.inject({
        method: 'GET',
        url: `/api/consultores/${consultorId}`
      });

      expect(getResponse.statusCode).toBe(404);
    });

    test('Debe retornar 404 al eliminar consultor inexistente', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/api/consultores/99999'
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
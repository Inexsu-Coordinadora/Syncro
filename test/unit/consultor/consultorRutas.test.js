"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const servidor_1 = require("../../../src/servidor");
describe('Consultor Routes - Pruebas de Integración', () => {
    let app;
    beforeAll(async () => {
        app = await (0, servidor_1.build)({ logger: false });
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });
    describe('POST /consultores', () => {
        test('Debe crear un consultor exitosamente', async () => {
            const nuevoConsultor = {
                nombre: 'María González',
                email: `test${Date.now()}@example.com`, // Email único
                telefono: '+57 310 555 1234',
                especialidad: 'Frontend'
            };
            const response = await app.inject({
                method: 'POST',
                url: '/consultores',
                payload: nuevoConsultor
            });
            expect(response.statusCode).toBe(201);
            expect(response.json()).toHaveProperty('id');
            expect(response.json().nombre).toBe(nuevoConsultor.nombre);
            expect(response.json().email).toBe(nuevoConsultor.email);
        });
        test('Debe retornar 400 con datos inválidos', async () => {
            const datosInvalidos = {
                nombre: '',
                email: 'email-invalido',
                telefono: '+57 310 555 1234'
            };
            const response = await app.inject({
                method: 'POST',
                url: '/consultores',
                payload: datosInvalidos
            });
            expect(response.statusCode).toBe(400);
            expect(response.json()).toHaveProperty('error');
        });
        test('Debe retornar 409 con email duplicado', async () => {
            const consultor = {
                nombre: 'Pedro Sánchez',
                email: 'pedro.duplicado@example.com',
                telefono: '+57 320 555 9999',
                especialidad: 'DevOps'
            };
            // Primera creación
            await app.inject({
                method: 'POST',
                url: '/consultores',
                payload: consultor
            });
            // Intento de duplicar
            const response = await app.inject({
                method: 'POST',
                url: '/consultores',
                payload: consultor
            });
            expect(response.statusCode).toBe(409);
            expect(response.json().error).toContain('email');
        });
    });
    describe('GET /consultores', () => {
        test('Debe retornar lista de consultores', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/consultores'
            });
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.json())).toBe(true);
        });
    });
    describe('GET /consultores/:id', () => {
        test('Debe retornar un consultor por ID', async () => {
            // Primero crear uno
            const nuevoConsultor = {
                nombre: 'Laura Martínez',
                email: `laura${Date.now()}@example.com`,
                telefono: '+57 315 555 7777',
                especialidad: 'QA'
            };
            const createResponse = await app.inject({
                method: 'POST',
                url: '/consultores',
                payload: nuevoConsultor
            });
            const consultorId = createResponse.json().id;
            // Ahora obtenerlo
            const response = await app.inject({
                method: 'GET',
                url: `/consultores/${consultorId}`
            });
            expect(response.statusCode).toBe(200);
            expect(response.json().id).toBe(consultorId);
            expect(response.json().nombre).toBe(nuevoConsultor.nombre);
        });
        test('Debe retornar 404 con ID inexistente', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/consultores/99999'
            });
            expect(response.statusCode).toBe(404);
        });
    });
    describe('PUT /consultores/:id', () => {
        test('Debe actualizar un consultor', async () => {
            // Crear consultor
            const nuevoConsultor = {
                nombre: 'Carlos Ruiz',
                email: `carlos${Date.now()}@example.com`,
                telefono: '+57 318 555 3333',
                especialidad: 'Mobile'
            };
            const createResponse = await app.inject({
                method: 'POST',
                url: '/consultores',
                payload: nuevoConsultor
            });
            const consultorId = createResponse.json().id;
            // Actualizar
            const datosActualizados = {
                nombre: 'Carlos Ruiz Actualizado',
                especialidad: 'Full Stack'
            };
            const response = await app.inject({
                method: 'PUT',
                url: `/consultores/${consultorId}`,
                payload: datosActualizados
            });
            expect(response.statusCode).toBe(200);
            expect(response.json().nombre).toBe(datosActualizados.nombre);
            expect(response.json().especialidad).toBe(datosActualizados.especialidad);
        });
    });
    describe('DELETE /consultores/:id', () => {
        test('Debe eliminar un consultor', async () => {
            // Crear consultor
            const nuevoConsultor = {
                nombre: 'Eliminar Test',
                email: `eliminar${Date.now()}@example.com`,
                telefono: '+57 319 555 4444',
                especialidad: 'Test'
            };
            const createResponse = await app.inject({
                method: 'POST',
                url: '/consultores',
                payload: nuevoConsultor
            });
            const consultorId = createResponse.json().id;
            // Eliminar
            const response = await app.inject({
                method: 'DELETE',
                url: `/consultores/${consultorId}`
            });
            expect(response.statusCode).toBe(204);
            // Verificar que ya no existe
            const getResponse = await app.inject({
                method: 'GET',
                url: `/consultores/${consultorId}`
            });
            expect(getResponse.statusCode).toBe(404);
        });
    });
});
//# sourceMappingURL=consultorRutas.test.js.map
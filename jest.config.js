module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/aplicacion/casosUso/proyecto/**',
    '!src/aplicacion/consultarProyectoPorCliente/**',
    '!src/infraestructura/repositorios/repositorioProyectoPostgres.ts',
    '!src/infraestructura/repositorios/repositorioAsignacionPostgres.ts',
    '!src/infraestructura/repositorios/repositorioClientePostgres.ts',
    '!src/infraestructura/cliente-db.ts',
    '!src/interfaces/rutas/proyectoRutas.ts',
    '!src/interfaces/rutas/clienteRutas.ts',
    '!src/interfaces/rutas/asignacionRutas.ts',
    '!src/dominio/repositorio/IRepositorioCliente.ts',
    '!src/aplicacion/errors/**',
    '!src/common/**',
    '!src/configuracion/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
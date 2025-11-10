CREATE TABLE IF NOT EXISTS tareas (
    id_tarea UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_tarea VARCHAR(100) NOT NULL,
    nombre_tarea VARCHAR(150) NOT NULL,
    estado VARCHAR(30) NOT NULL CHECK (estado IN ('pendiente', 'en_progreso', 'bloqueada', 'completada')),
    fecha_limite DATE NOT NULL,
    id_proyecto INTEGER NOT NULL,
    id_consultor UUID,

    FOREIGN KEY (id_proyecto) REFERENCES proyectos("idProyecto") ON DELETE CASCADE,
    FOREIGN KEY (id_consultor) REFERENCES consultores(idConsultor),
    
    CONSTRAINT tarea_unica_en_proyecto UNIQUE (id_proyecto, codigo_tarea)
);

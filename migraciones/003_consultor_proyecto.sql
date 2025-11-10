CREATE TABLE IF NOT EXISTS consultor_proyecto (
    id_consultor UUID NOT NULL,
    id_proyecto UUID NOT NULL,
    rol VARCHAR(100),
    PRIMARY KEY (id_consultor, id_proyecto),
    FOREIGN KEY (id_consultor) REFERENCES consultores(idConsultor),
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto)
);

/*
  Datos de ejemplo: llena SOLO estas tablas (según tu esquema):

  dbo.Universidad
    - IdUniversidad  → identity (no se inserta)
    - Nombre         → nombre de la universidad
    - IdEmpresa      → FK a Empresa (se toma el primer IdEmpresa de dbo.Empresa)

  dbo.UniversidadDetalle
    - IdDetalle      → identity (no se inserta)
    - IdUniversidad  → FK al IdUniversidad recién creado
    - CarreraNombre  → nombre de la carrera
    - PuntajeMinimo  → decimal(5,2) en BD: se guarda con 2 decimales
    - PuntajeMaximo  → decimal(5,2)
    - Anio           → año (ej. 2024)

  Requisito: al menos una fila en dbo.Empresa.
  Ejecución: SSMS / sqlcmd. Si ya existe la misma universidad (Nombre + IdEmpresa), no duplica.
*/

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRANSACTION;

DECLARE @IdEmpresa INT =
(
    SELECT TOP (1) e.IdEmpresa
    FROM dbo.Empresa AS e
    ORDER BY e.IdEmpresa
);

IF @IdEmpresa IS NULL
BEGIN
    THROW 50001, 'No hay empresas en dbo.Empresa. Cree una empresa antes de ejecutar este script.', 1;
END;

/* Carreras y puntajes de referencia (UNIVERSIDAD NACIONAL DE CAJAMARCA — mismos valores que en la captura). */
IF OBJECT_ID('tempdb..#CarrerasBase') IS NOT NULL
    DROP TABLE #CarrerasBase;

CREATE TABLE #CarrerasBase
(
    CarreraNombre VARCHAR(150) NOT NULL,
    PuntajeMinimo DECIMAL(9, 3) NOT NULL,
    PuntajeMaximo DECIMAL(9, 3) NOT NULL
);

INSERT INTO #CarrerasBase (CarreraNombre, PuntajeMinimo, PuntajeMaximo)
VALUES
    (N'ADMINISTRACIÓN', 348.910, 201.576),
    (N'AGRONOMÍA', 373.244, 255.672),
    (N'BIOTECNOLOGÍA', 390.456, 298.564),
    (N'CONTABILIDAD', 284.754, 210.094),
    (N'DERECHO', 412.992, 293.800),
    (N'ECONOMÍA', 330.584, 200.572),
    (N'EDUCACION LENGUAJE Y LITERATURA', 341.842, 212.874),
    (N'EDUCACION MATEMÁTICA Y FÍSICA', 314.178, 207.918),
    (N'ENFERMERÍA', 373.244, 251.820),
    (N'INGENIERÍA AMBIENTAL', 273.124, 190.425),
    (N'INGENIERÍA CIVIL', 432.848, 346.576),
    (N'INGENIERÍA DE MINAS', 356.508, 255.672),
    (N'INGENIERÍA DE SISTEMAS', 363.294, 248.006),
    (N'INGENIERÍA FORESTAL', 244.040, 150.446),
    (N'INGENIERÍA GEOLÓGICA', 343.804, 237.828),
    (N'INGENIERÍA HIDRÁULICA', 290.452, 200.100),
    (N'MEDICINA HUMANA', 506.488, 424.004),
    (N'MEDICINA VETERINARIA', 264.546, 179.492),
    (N'OBSTETRICIA', 395.872, 266.496),
    (N'SOCIOLOGÍA', 309.362, 193.364),
    (N'TURISMO Y HOTELERÍA', 274.624, 168.906);

DECLARE @Universidades TABLE
(
    Orden INT NOT NULL,
    Nombre VARCHAR(150) NOT NULL,
    Factor DECIMAL(9, 6) NOT NULL
);

INSERT INTO @Universidades (Orden, Nombre, Factor)
VALUES
    (1, N'UNIVERSIDAD NACIONAL DE CAJAMARCA', 1.000000),
    (2, N'UNIVERSIDAD NACIONAL DE CHOTA', 0.965000),
    (3, N'UNIVERSIDAD NACIONAL DE INGENIERÍA', 1.080000),
    (4, N'UNIVERSIDAD NACIONAL DE PIURA', 0.990000),
    (5, N'UNIVERSIDAD NACIONAL DE SAN AGUSTÍN DE AREQUIPA', 1.020000),
    (6, N'UNIVERSIDAD NACIONAL DE TRUJILLO', 1.015000),
    (7, N'UNIVERSIDAD NACIONAL DEL ALTIPLANO', 0.975000),
    (8, N'UNIVERSIDAD NACIONAL JORGE BASADRE GROHMANN', 1.010000),
    (9, N'UNIVERSIDAD NACIONAL MAYOR DE SAN MARCOS', 1.095000),
    (10, N'UNIVERSIDAD NACIONAL PEDRO RUIZ GALLO', 0.985000),
    (11, N'UNIVERSIDAD NACIONAL SAN LUIS GONZAGA', 0.970000),
    (12, N'UNIVERSIDAD PRIVADA DE TACNA', 0.960000);

DECLARE @Nombre VARCHAR(150);
DECLARE @Factor DECIMAL(9, 6);
DECLARE @IdUniversidad INT;

DECLARE uni CURSOR LOCAL FAST_FORWARD FOR
SELECT u.Nombre, u.Factor
FROM @Universidades AS u
ORDER BY u.Orden;

OPEN uni;

FETCH NEXT FROM uni
INTO @Nombre, @Factor;

WHILE @@FETCH_STATUS = 0
BEGIN
    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.Universidad AS x
        WHERE x.IdEmpresa = @IdEmpresa
              AND x.Nombre = @Nombre
    )
    BEGIN
        INSERT INTO dbo.Universidad (IdEmpresa, Nombre)
        VALUES (@IdEmpresa, @Nombre);

        SET @IdUniversidad = CONVERT(INT, SCOPE_IDENTITY());

        INSERT INTO dbo.UniversidadDetalle
        (
            IdUniversidad,
            CarreraNombre,
            PuntajeMinimo,
            PuntajeMaximo,
            Anio
        )
        SELECT @IdUniversidad,
               b.CarreraNombre,
               CAST(ROUND(b.PuntajeMinimo * @Factor, 2) AS DECIMAL(5, 2)),
               CAST(ROUND(b.PuntajeMaximo * @Factor, 2) AS DECIMAL(5, 2)),
               2024
        FROM #CarrerasBase AS b;
    END;

    FETCH NEXT FROM uni
    INTO @Nombre, @Factor;
END;

CLOSE uni;
DEALLOCATE uni;

DROP TABLE #CarrerasBase;

COMMIT TRANSACTION;

PRINT N'Seed de universidades y carreras finalizado (omitió filas si el nombre ya existía para la empresa).';

CREATE PROCEDURE [dbo].[MAC_SAVE_APODERADOS_ALUMNO]
    @IdAlumno INT,
    @ApoderadosXml XML
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PrevApoderados TABLE (IdApoderado INT);

    INSERT INTO @PrevApoderados (IdApoderado)
    SELECT aa.IdApoderado
    FROM dbo.AlumnoApoderado AS aa
    WHERE aa.IdAlumno = @IdAlumno;

    DELETE FROM dbo.AlumnoApoderado
    WHERE IdAlumno = @IdAlumno;

    DECLARE @T TABLE
    (
        Idx INT IDENTITY (1, 1) NOT NULL PRIMARY KEY,
        IdApoderado INT NULL,
        DNI VARCHAR(15) NULL,
        Nombre VARCHAR(150) NULL,
        WhatsApp VARCHAR(15) NULL,
        IdParamParentesco INT NOT NULL
    );

    INSERT INTO @T
    (
        IdApoderado,
        DNI,
        Nombre,
        WhatsApp,
        IdParamParentesco
    )
    SELECT NULLIF(T.n.value('@IdApoderado', 'INT'), 0),
           NULLIF(LTRIM(RTRIM(T.n.value('@DNI', 'VARCHAR(15)'))), ''),
           NULLIF(LTRIM(RTRIM(T.n.value('@Nombre', 'VARCHAR(150)'))), ''),
           NULLIF(LTRIM(RTRIM(T.n.value('@WhatsApp', 'VARCHAR(15)'))), ''),
           T.n.value('@IdParamParentesco', 'INT')
    FROM @ApoderadosXml.nodes('/root/a') AS T(n)
    WHERE T.n.value('@IdParamParentesco', 'INT') > 0;

    DECLARE @i INT = 1;
    DECLARE @max INT =
    (
        SELECT COUNT(1) FROM @T
    );

    DECLARE @IdApoderado INT;
    DECLARE @DniAp VARCHAR(15);
    DECLARE @NomAp VARCHAR(150);
    DECLARE @WaAp VARCHAR(15);
    DECLARE @IdParamParentesco INT;
    DECLARE @FinalId INT;

    WHILE @i <= @max
    BEGIN
        SELECT @IdApoderado = t.IdApoderado,
               @DniAp = t.DNI,
               @NomAp = t.Nombre,
               @WaAp = t.WhatsApp,
               @IdParamParentesco = t.IdParamParentesco
        FROM @T AS t
        WHERE t.Idx = @i;

        IF (@IdApoderado IS NULL OR @IdApoderado = 0)
        BEGIN
            INSERT INTO dbo.Apoderado
            (
                DNI,
                Nombre,
                WhatsApp,
                IdParamParentesco
            )
            VALUES
            (@DniAp, @NomAp, @WaAp, @IdParamParentesco);

            SET @FinalId = SCOPE_IDENTITY();
        END;
        ELSE
        BEGIN
            UPDATE dbo.Apoderado
            SET DNI = @DniAp,
                Nombre = @NomAp,
                WhatsApp = @WaAp,
                IdParamParentesco = @IdParamParentesco
            WHERE IdApoderado = @IdApoderado;

            SET @FinalId = @IdApoderado;
        END;

        INSERT INTO dbo.AlumnoApoderado
        (
            IdAlumno,
            IdApoderado,
            Tipo
        )
        VALUES
        (@IdAlumno, @FinalId, @IdParamParentesco);

        SET @i = @i + 1;
    END;

    DELETE FROM dbo.Apoderado
    WHERE IdApoderado IN (SELECT p.IdApoderado FROM @PrevApoderados AS p)
      AND NOT EXISTS
    (
        SELECT 1
        FROM dbo.AlumnoApoderado AS aa
        WHERE aa.IdApoderado = Apoderado.IdApoderado
    );
END

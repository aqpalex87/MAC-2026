CREATE PROCEDURE [dbo].[MAC_INSERT_ASISTENCIA_MANUAL]
    @IdEmpresa INT,
    @IdSede INT = NULL,
    @DNI VARCHAR(20),
    @IdParamEvento INT,
    @Observacion VARCHAR(200) = NULL,
    @IdAsistencia INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdAlumno INT;
    DECLARE @SedeNombre VARCHAR(100);
    DECLARE @ApellidosNombres VARCHAR(200);

    SELECT TOP (1)
        @IdAlumno = a.IdAlumno,
        @SedeNombre = s.Nombre,
        @ApellidosNombres = LTRIM(RTRIM(ISNULL(a.Apellidos, ''))) + ' ' + LTRIM(RTRIM(ISNULL(a.Nombres, '')))
    FROM dbo.Alumno AS a
    INNER JOIN dbo.Sedes AS s ON s.IdSede = a.IdSede
    WHERE s.IdEmpresa = @IdEmpresa
      AND (@IdSede IS NULL OR a.IdSede = @IdSede)
      AND a.DNI = LTRIM(RTRIM(@DNI))
    ORDER BY a.IdAlumno DESC;

    IF @IdAlumno IS NULL
    BEGIN
        RAISERROR('No se encontró alumno con ese DNI en la sede de sesión.', 16, 1);
        RETURN;
    END;

    INSERT INTO dbo.Asistencia
    (
        FechaHora,
        Sede,
        ApellidosNombres,
        Observacion,
        IdParamEvento,
        IdAlumno
    )
    VALUES
    (
        SYSDATETIME(),
        @SedeNombre,
        NULLIF(LTRIM(RTRIM(ISNULL(@ApellidosNombres, ''))), ''),
        NULLIF(LTRIM(RTRIM(ISNULL(@Observacion, ''))), ''),
        @IdParamEvento,
        @IdAlumno
    );

    SET @IdAsistencia = SCOPE_IDENTITY();
END

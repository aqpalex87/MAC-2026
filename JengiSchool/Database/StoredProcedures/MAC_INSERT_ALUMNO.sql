ALTER PROCEDURE [dbo].[MAC_INSERT_ALUMNO]
    @DNI VARCHAR(15) = NULL,
    @Apellidos VARCHAR(100) = NULL,
    @Nombres VARCHAR(100) = NULL,
    @IdParamSexo INT = NULL,
    @Dia INT = NULL,
    @Mes INT = NULL,
    @Anio INT = NULL,
    @CarreraPostula VARCHAR(150) = NULL,
    @WhatsApp VARCHAR(15) = NULL,
    @IE_Procedencia VARCHAR(150) = NULL,
    @IE_Ubigeo VARCHAR(20) = NULL,
    @IdSede INT,
    @IdUniversidad INT,
    @IdUniversidadDetalle INT,
    @IdCiclo INT = NULL,
    @IdAlumno INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Alumno
    (
        DNI,
        Apellidos,
        Nombres,
        IdParamSexo,
        Dia,
        Mes,
        Anio,
        CarreraPostula,
        WhatsApp,
        IE_Procedencia,
        IE_Ubigeo,
        IdSede,
        IdUniversidad,
        IdUniversidadDetalle,
        IdCiclo,
        FechaRegistro
    )
    VALUES
    (
        NULLIF(LTRIM(RTRIM(ISNULL(@DNI, ''))), ''),
        NULLIF(LTRIM(RTRIM(ISNULL(@Apellidos, ''))), ''),
        NULLIF(LTRIM(RTRIM(ISNULL(@Nombres, ''))), ''),
        @IdParamSexo,
        @Dia,
        @Mes,
        @Anio,
        NULLIF(LTRIM(RTRIM(ISNULL(@CarreraPostula, ''))), ''),
        NULLIF(LTRIM(RTRIM(ISNULL(@WhatsApp, ''))), ''),
        NULLIF(LTRIM(RTRIM(ISNULL(@IE_Procedencia, ''))), ''),
        NULLIF(LTRIM(RTRIM(ISNULL(@IE_Ubigeo, ''))), ''),
        @IdSede,
        @IdUniversidad,
        @IdUniversidadDetalle,
        @IdCiclo,
        SYSUTCDATETIME()
    );

    SET @IdAlumno = SCOPE_IDENTITY();
END

use academias
go
CREATE PROCEDURE [dbo].[MAC_UPDATE_ALUMNO]
    @IdAlumno INT,
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
    @IdUniversidadDetalle INT
AS
BEGIN


    UPDATE dbo.Alumno
    SET DNI = NULLIF(LTRIM(RTRIM(ISNULL(@DNI, ''))), ''),
        Apellidos = NULLIF(LTRIM(RTRIM(ISNULL(@Apellidos, ''))), ''),
        Nombres = NULLIF(LTRIM(RTRIM(ISNULL(@Nombres, ''))), ''),
        IdParamSexo = @IdParamSexo,
        Dia = @Dia,
        Mes = @Mes,
        Anio = @Anio,
        CarreraPostula = NULLIF(LTRIM(RTRIM(ISNULL(@CarreraPostula, ''))), ''),
        WhatsApp = NULLIF(LTRIM(RTRIM(ISNULL(@WhatsApp, ''))), ''),
        IE_Procedencia = NULLIF(LTRIM(RTRIM(ISNULL(@IE_Procedencia, ''))), ''),
        IE_Ubigeo = NULLIF(LTRIM(RTRIM(ISNULL(@IE_Ubigeo, ''))), ''),
        IdSede = @IdSede,
        IdUniversidad = @IdUniversidad,
        IdUniversidadDetalle = @IdUniversidadDetalle
    WHERE IdAlumno = @IdAlumno;
END

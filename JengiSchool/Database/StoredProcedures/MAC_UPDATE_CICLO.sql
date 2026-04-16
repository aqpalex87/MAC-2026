CREATE PROCEDURE [dbo].[MAC_UPDATE_CICLO]
    @IdCiclo INT,
    @Nombre VARCHAR(50),
    @FechaInicio DATE = NULL,
    @FechaFin DATE = NULL,
    @Activo BIT = 1,
    @IdSede INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Ciclo
    SET Nombre = LTRIM(RTRIM(@Nombre)),
        FechaInicio = @FechaInicio,
        FechaFin = @FechaFin,
        Activo = ISNULL(@Activo, 1),
        IdSede = @IdSede
    WHERE IdCiclo = @IdCiclo;
END

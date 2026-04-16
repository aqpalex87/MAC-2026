CREATE PROCEDURE [dbo].[MAC_INSERT_CICLO]
    @Nombre VARCHAR(50),
    @FechaInicio DATE = NULL,
    @FechaFin DATE = NULL,
    @Activo BIT = 1,
    @IdSede INT,
    @IdCiclo INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Ciclo
    (
        Nombre,
        FechaInicio,
        FechaFin,
        Activo,
        IdSede
    )
    VALUES
    (
        LTRIM(RTRIM(@Nombre)),
        @FechaInicio,
        @FechaFin,
        ISNULL(@Activo, 1),
        @IdSede
    );

    SET @IdCiclo = SCOPE_IDENTITY();
END

/*
  Agrega FechaRegistro a Alumno (datetime) si no existe.
  Ejecutar una vez en la base de datos de la aplicación.
*/
SET NOCOUNT ON;

IF COL_LENGTH(N'dbo.Alumno', N'FechaRegistro') IS NULL
BEGIN
    ALTER TABLE dbo.Alumno
    ADD FechaRegistro DATETIME2(0) NULL;

    EXEC(N'UPDATE dbo.Alumno SET FechaRegistro = SYSUTCDATETIME() WHERE FechaRegistro IS NULL');
END
GO

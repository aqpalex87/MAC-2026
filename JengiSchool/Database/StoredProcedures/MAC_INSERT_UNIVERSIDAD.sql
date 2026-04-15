CREATE PROCEDURE [dbo].[MAC_INSERT_UNIVERSIDAD]
    @IdEmpresa INT,
    @Nombre VARCHAR(150),
    @IdUniversidad INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Universidad (IdEmpresa, Nombre)
    VALUES (@IdEmpresa, LTRIM(RTRIM(@Nombre)));

    SET @IdUniversidad = SCOPE_IDENTITY();
END

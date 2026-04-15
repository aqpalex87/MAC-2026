CREATE PROCEDURE [dbo].[MAC_DELETE_SEDE]
    @IdSede INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Sedes
    SET Activo = 0
    WHERE IdSede = @IdSede;
END

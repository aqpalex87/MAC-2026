CREATE PROCEDURE [dbo].[MAC_SELECT_UNIVERSIDADES_COMBO]
    @IdEmpresa INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        u.IdUniversidad,
        u.Nombre,
        u.IdEmpresa
    FROM dbo.Universidad AS u
    WHERE (@IdEmpresa IS NULL OR u.IdEmpresa = @IdEmpresa)
    ORDER BY u.Nombre;
END

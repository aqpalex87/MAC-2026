ALTER PROCEDURE [dbo].[MAC_DELETE_UNIVERSIDAD]
    @IdUniversidad INT
AS
BEGIN

    DELETE FROM dbo.UniversidadDetalle
    WHERE IdUniversidad = @IdUniversidad;

    DELETE FROM dbo.Universidad
    WHERE IdUniversidad = @IdUniversidad;
END

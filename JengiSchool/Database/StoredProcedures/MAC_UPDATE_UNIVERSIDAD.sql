ALTER PROCEDURE [dbo].[MAC_UPDATE_UNIVERSIDAD]
    @IdUniversidad INT,
    @IdEmpresa INT,
    @Nombre VARCHAR(150)
AS
BEGIN


    UPDATE dbo.Universidad
    SET
        IdEmpresa = @IdEmpresa,
        Nombre = LTRIM(RTRIM(@Nombre))
    WHERE IdUniversidad = @IdUniversidad;
END

CREATE PROCEDURE [dbo].[MAC_DELETE_USUARIO]
    @IdUsuario INT
AS
BEGIN

    DELETE FROM dbo.Usuarios
    WHERE IdUsuario = @IdUsuario;
END

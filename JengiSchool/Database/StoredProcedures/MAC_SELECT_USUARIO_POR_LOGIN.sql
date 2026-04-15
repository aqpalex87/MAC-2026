CREATE PROCEDURE [dbo].[MAC_SELECT_USUARIO_POR_LOGIN]
    @Usuario VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        u.IdUsuario,
        u.Usuario,
        u.PasswordHash,
        u.IdRol,
        r.Nombre AS RolNombre,
        u.Activo
    FROM dbo.Usuarios u
    INNER JOIN dbo.Roles r ON r.IdRol = u.IdRol
    WHERE u.Usuario = @Usuario;
END

CREATE OR ALTER PROCEDURE [dbo].[MAC_SELECT_MENUS_POR_USUARIO]
    @Usuario VARCHAR(50),
    @IdEmpresa INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        m.IdMenu,
        m.Nombre,
        m.Ruta,
        m.Icono,
        m.IdPadre,
        m.Orden,
        m.Activo
    FROM dbo.Usuarios u
    INNER JOIN dbo.RolMenu rm ON rm.IdRol = u.IdRol
    INNER JOIN dbo.Menus m ON m.IdMenu = rm.IdMenu
    WHERE u.Usuario = @Usuario
      AND (@IdEmpresa IS NULL OR u.IdEmpresa = @IdEmpresa)
      AND u.Activo = 1
      AND m.Activo = 1
    ORDER BY ISNULL(m.IdPadre, 0), ISNULL(m.Orden, 0), m.IdMenu;
END

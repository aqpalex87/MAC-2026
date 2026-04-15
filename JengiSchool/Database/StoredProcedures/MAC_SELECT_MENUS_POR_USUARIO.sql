/* Incluye menús padre (ancestros) aunque no estén en RolMenu, para que la jerarquía IdPadre funcione. */
ALTER PROCEDURE [dbo].[MAC_SELECT_MENUS_POR_USUARIO]
    @Usuario VARCHAR(50),
    @IdEmpresa INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH Asignados AS (
        SELECT DISTINCT rm.IdMenu
        FROM dbo.Usuarios u
        INNER JOIN dbo.RolMenu rm ON rm.IdRol = u.IdRol
        WHERE u.Usuario = @Usuario
          AND (@IdEmpresa IS NULL OR u.IdEmpresa = @IdEmpresa)
          AND u.Activo = 1
    ),
    Jerarquia AS (
        SELECT m.IdMenu, m.IdPadre
        FROM dbo.Menus m
        INNER JOIN Asignados a ON a.IdMenu = m.IdMenu
        WHERE m.Activo = 1

        UNION ALL

        SELECT p.IdMenu, p.IdPadre
        FROM dbo.Menus p
        INNER JOIN Jerarquia j ON p.IdMenu = j.IdPadre
        WHERE p.Activo = 1
    )
    SELECT DISTINCT
        m.IdMenu,
        m.Nombre,
        m.Ruta,
        m.Icono,
        m.IdPadre,
        m.Orden,
        m.Activo
    FROM dbo.Menus m
    INNER JOIN Jerarquia j ON j.IdMenu = m.IdMenu
    ORDER BY ISNULL(m.IdPadre, 0), ISNULL(m.Orden, 0), m.IdMenu
    OPTION (MAXRECURSION 100);
END

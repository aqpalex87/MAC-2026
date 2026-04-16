/*
  Inserta la opción de menú "Mantenimiento de ciclos" y (opcional) la asigna a un rol.

  Antes de ejecutar:
  1) Revisa el padre (@IdPadre): por defecto busca un menú cuyo nombre contenga "MANTENIMIENT".
     Si no coincide, ejecuta:
       SELECT IdMenu, Nombre, IdPadre, Ruta FROM dbo.Menus ORDER BY IdPadre, Orden, IdMenu;
     y asigna manualmente SET @IdPadre = <IdMenu del grupo padre>;
  2) Para RolMenu, cambia @IdRol al IdRol que corresponda (o comenta el bloque final).
*/

SET NOCOUNT ON;

DECLARE @IdPadre INT =
(
    SELECT TOP (1) m.IdMenu
    FROM dbo.Menus AS m
    WHERE UPPER(LTRIM(RTRIM(m.Nombre))) LIKE N'%MANTENIMIENT%'
    ORDER BY m.IdMenu
);

IF NOT EXISTS
(
    SELECT 1
    FROM dbo.Menus AS x
    WHERE LTRIM(RTRIM(UPPER(x.Nombre))) = N'MANTENIMIENTO CICLOS'
       OR LTRIM(RTRIM(ISNULL(x.Ruta, N''))) IN (N'/mantenimiento-parametros/ciclos', N'mantenimiento-parametros/ciclos')
)
BEGIN
    INSERT INTO dbo.Menus
    (
        Nombre,
        Ruta,
        Icono,
        IdPadre,
        Orden,
        Activo
    )
    VALUES
    (
        N'MANTENIMIENTO CICLOS',
        N'/mantenimiento-parametros/ciclos',
        N'event_note',
        @IdPadre,
        70,
        1
    );
END;

/* --- Opcional: dar permiso al rol (ajusta @IdRol) --- */
DECLARE @IdRol INT = 1; /* <-- IdRol deseado */

DECLARE @IdMenuCiclo INT =
(
    SELECT TOP (1) m.IdMenu
    FROM dbo.Menus AS m
    WHERE LTRIM(RTRIM(ISNULL(m.Ruta, N''))) IN (N'/mantenimiento-parametros/ciclos', N'mantenimiento-parametros/ciclos')
    ORDER BY m.IdMenu DESC
);

IF @IdRol > 0
   AND @IdMenuCiclo IS NOT NULL
   AND NOT EXISTS
   (
       SELECT 1
       FROM dbo.RolMenu AS rm
       WHERE rm.IdRol = @IdRol
             AND rm.IdMenu = @IdMenuCiclo
   )
BEGIN
    INSERT INTO dbo.RolMenu (IdRol, IdMenu)
    VALUES (@IdRol, @IdMenuCiclo);
END;

/*
  Menú "Asistencias" y asignación opcional a RolMenu.
  Ruta Angular: /mantenimiento-parametros/asistencias
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
    WHERE LTRIM(RTRIM(UPPER(x.Nombre))) = N'ASISTENCIAS'
       OR LTRIM(RTRIM(ISNULL(x.Ruta, N''))) IN (N'/mantenimiento-parametros/asistencias', N'mantenimiento-parametros/asistencias')
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
        N'ASISTENCIAS',
        N'/mantenimiento-parametros/asistencias',
        N'fact_check',
        @IdPadre,
        80,
        1
    );
END;

DECLARE @IdRol INT = 1; -- Cambiar según el rol objetivo
DECLARE @IdMenuAsistencias INT =
(
    SELECT TOP (1) m.IdMenu
    FROM dbo.Menus AS m
    WHERE LTRIM(RTRIM(ISNULL(m.Ruta, N''))) IN (N'/mantenimiento-parametros/asistencias', N'mantenimiento-parametros/asistencias')
    ORDER BY m.IdMenu DESC
);

IF @IdRol > 0
   AND @IdMenuAsistencias IS NOT NULL
   AND NOT EXISTS
   (
       SELECT 1
       FROM dbo.RolMenu AS rm
       WHERE rm.IdRol = @IdRol
         AND rm.IdMenu = @IdMenuAsistencias
   )
BEGIN
    INSERT INTO dbo.RolMenu (IdRol, IdMenu)
    VALUES (@IdRol, @IdMenuAsistencias);
END;

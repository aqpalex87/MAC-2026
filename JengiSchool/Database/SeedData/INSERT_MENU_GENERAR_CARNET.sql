/*
  Menú "Generar carnet" y asignación opcional a rol.
  Ruta Angular: /mantenimiento-parametros/carnets

  Antes de ejecutar: revisa @IdPadre (mismo criterio que INSERT_MENU_CICLOS).
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
    WHERE LTRIM(RTRIM(UPPER(x.Nombre))) = N'GENERAR CARNET'
       OR LTRIM(RTRIM(ISNULL(x.Ruta, N''))) IN (N'/mantenimiento-parametros/carnets', N'mantenimiento-parametros/carnets')
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
        N'GENERAR CARNET',
        N'/mantenimiento-parametros/carnets',
        N'badge',
        @IdPadre,
        75,
        1
    );
END;

DECLARE @IdRol INT = 1;

DECLARE @IdMenuCarnet INT =
(
    SELECT TOP (1) m.IdMenu
    FROM dbo.Menus AS m
    WHERE LTRIM(RTRIM(ISNULL(m.Ruta, N''))) IN (N'/mantenimiento-parametros/carnets', N'mantenimiento-parametros/carnets')
    ORDER BY m.IdMenu DESC
);

IF @IdRol > 0
   AND @IdMenuCarnet IS NOT NULL
   AND NOT EXISTS
   (
       SELECT 1
       FROM dbo.RolMenu AS rm
       WHERE rm.IdRol = @IdRol
             AND rm.IdMenu = @IdMenuCarnet
   )
BEGIN
    INSERT INTO dbo.RolMenu (IdRol, IdMenu)
    VALUES (@IdRol, @IdMenuCarnet);
END;

/*
  Crea ParametroTipo / Parametro para SEXO y PARENTESCO si aún no existen.
  Ejecutar una sola vez después de crear las tablas.
*/

SET NOCOUNT ON;

IF NOT EXISTS (SELECT 1 FROM dbo.ParametroTipo WHERE Codigo = N'SEXO')
BEGIN
    INSERT INTO dbo.ParametroTipo (Codigo, Nombre, Activo) VALUES (N'SEXO', N'Sexo', 1);
END;

IF NOT EXISTS (SELECT 1 FROM dbo.ParametroTipo WHERE Codigo = N'PARENTESCO')
BEGIN
    INSERT INTO dbo.ParametroTipo (Codigo, Nombre, Activo) VALUES (N'PARENTESCO', N'Parentesco', 1);
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Parametro p INNER JOIN dbo.ParametroTipo t ON t.IdParametroTipo = p.IdParametroTipo WHERE t.Codigo = N'SEXO' AND p.Codigo = N'M')
BEGIN
    INSERT INTO dbo.Parametro (IdParametroTipo, Codigo, Nombre, Orden, Activo)
    SELECT t.IdParametroTipo, N'M', N'Masculino', 1, 1 FROM dbo.ParametroTipo t WHERE t.Codigo = N'SEXO';
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Parametro p INNER JOIN dbo.ParametroTipo t ON t.IdParametroTipo = p.IdParametroTipo WHERE t.Codigo = N'SEXO' AND p.Codigo = N'F')
BEGIN
    INSERT INTO dbo.Parametro (IdParametroTipo, Codigo, Nombre, Orden, Activo)
    SELECT t.IdParametroTipo, N'F', N'Femenino', 2, 1 FROM dbo.ParametroTipo t WHERE t.Codigo = N'SEXO';
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Parametro p INNER JOIN dbo.ParametroTipo t ON t.IdParametroTipo = p.IdParametroTipo WHERE t.Codigo = N'PARENTESCO' AND p.Codigo = N'PADRE')
BEGIN
    INSERT INTO dbo.Parametro (IdParametroTipo, Codigo, Nombre, Orden, Activo)
    SELECT t.IdParametroTipo, N'PADRE', N'Padre', 1, 1 FROM dbo.ParametroTipo t WHERE t.Codigo = N'PARENTESCO';
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Parametro p INNER JOIN dbo.ParametroTipo t ON t.IdParametroTipo = p.IdParametroTipo WHERE t.Codigo = N'PARENTESCO' AND p.Codigo = N'MADRE')
BEGIN
    INSERT INTO dbo.Parametro (IdParametroTipo, Codigo, Nombre, Orden, Activo)
    SELECT t.IdParametroTipo, N'MADRE', N'Madre', 2, 1 FROM dbo.ParametroTipo t WHERE t.Codigo = N'PARENTESCO';
END;

PRINT N'Seed ParametroTipo/Parametro (SEXO, PARENTESCO) listo.';

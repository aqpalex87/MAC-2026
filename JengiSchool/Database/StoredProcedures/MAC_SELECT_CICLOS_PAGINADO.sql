CREATE PROCEDURE [dbo].[MAC_SELECT_CICLOS_PAGINADO]
    @IdEmpresa INT = NULL,
    @IdSede INT = NULL,
    @P_NOMBRE VARCHAR(50) = '',
    @P_PAGENUMBER INT = 1,
    @P_PAGESIZE INT = 10,
    @P_TOTALROWS INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NombreFiltro VARCHAR(50) = LTRIM(RTRIM(ISNULL(@P_NOMBRE, '')));
    DECLARE @Offset INT = (@P_PAGENUMBER - 1) * @P_PAGESIZE;

    SELECT @P_TOTALROWS = COUNT(1)
    FROM dbo.Ciclo AS c
    INNER JOIN dbo.Sedes AS s ON s.IdSede = c.IdSede
    INNER JOIN dbo.Empresas AS e ON e.IdEmpresa = s.IdEmpresa
    WHERE (@IdEmpresa IS NULL OR s.IdEmpresa = @IdEmpresa)
      AND (@IdSede IS NULL OR c.IdSede = @IdSede)
      AND (@NombreFiltro = '' OR c.Nombre LIKE '%' + @NombreFiltro + '%');

    SELECT
        c.IdCiclo,
        c.Nombre,
        c.FechaInicio,
        c.FechaFin,
        c.Activo,
        c.IdSede,
        s.Nombre AS NombreSede,
        s.IdEmpresa,
        e.Nombre AS NombreEmpresa
    FROM dbo.Ciclo AS c
    INNER JOIN dbo.Sedes AS s ON s.IdSede = c.IdSede
    INNER JOIN dbo.Empresas AS e ON e.IdEmpresa = s.IdEmpresa
    WHERE (@IdEmpresa IS NULL OR s.IdEmpresa = @IdEmpresa)
      AND (@IdSede IS NULL OR c.IdSede = @IdSede)
      AND (@NombreFiltro = '' OR c.Nombre LIKE '%' + @NombreFiltro + '%')
    ORDER BY c.FechaInicio DESC, c.Nombre
    OFFSET @Offset ROWS FETCH NEXT @P_PAGESIZE ROWS ONLY;
END

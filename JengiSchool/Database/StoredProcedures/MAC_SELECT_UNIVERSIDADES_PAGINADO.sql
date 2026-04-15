CREATE PROCEDURE [dbo].[MAC_SELECT_UNIVERSIDADES_PAGINADO]
    @IdEmpresa INT = NULL,
    @P_NOMBRE VARCHAR(150) = '',
    @P_PAGENUMBER INT = 1,
    @P_PAGESIZE INT = 10,
    @P_TOTALROWS INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NombreFiltro VARCHAR(150) = LTRIM(RTRIM(ISNULL(@P_NOMBRE, '')));
    DECLARE @Offset INT = (@P_PAGENUMBER - 1) * @P_PAGESIZE;

    SELECT @P_TOTALROWS = COUNT(1)
    FROM dbo.Universidad u
    INNER JOIN dbo.Empresas e ON e.IdEmpresa = u.IdEmpresa
    WHERE (@IdEmpresa IS NULL OR u.IdEmpresa = @IdEmpresa)
      AND (@NombreFiltro = '' OR u.Nombre LIKE '%' + @NombreFiltro + '%');

    SELECT
        u.IdUniversidad,
        u.IdEmpresa,
        e.Nombre AS NombreEmpresa,
        u.Nombre
    FROM dbo.Universidad u
    INNER JOIN dbo.Empresas e ON e.IdEmpresa = u.IdEmpresa
    WHERE (@IdEmpresa IS NULL OR u.IdEmpresa = @IdEmpresa)
      AND (@NombreFiltro = '' OR u.Nombre LIKE '%' + @NombreFiltro + '%')
    ORDER BY u.Nombre
    OFFSET @Offset ROWS FETCH NEXT @P_PAGESIZE ROWS ONLY;
END

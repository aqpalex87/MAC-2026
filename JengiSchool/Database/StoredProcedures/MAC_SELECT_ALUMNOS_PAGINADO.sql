ALTER PROCEDURE [dbo].[MAC_SELECT_ALUMNOS_PAGINADO]
    @IdEmpresa INT = NULL,
    @IdSede INT = NULL,
    @P_FILTRO VARCHAR(200) = '',
    @P_PAGENUMBER INT = 1,
    @P_PAGESIZE INT = 10,
    @P_TOTALROWS INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Filtro VARCHAR(200) = LTRIM(RTRIM(ISNULL(@P_FILTRO, '')));
    DECLARE @Offset INT = (@P_PAGENUMBER - 1) * @P_PAGESIZE;

    SELECT @P_TOTALROWS = COUNT(1)
    FROM dbo.Alumno AS a
    INNER JOIN dbo.Sedes AS s ON s.IdSede = a.IdSede
    INNER JOIN dbo.Empresas AS e ON e.IdEmpresa = s.IdEmpresa
    LEFT JOIN dbo.Universidad AS u ON u.IdUniversidad = a.IdUniversidad
    LEFT JOIN dbo.UniversidadDetalle AS ud ON ud.IdDetalle = a.IdUniversidadDetalle
    WHERE (@IdEmpresa IS NULL OR s.IdEmpresa = @IdEmpresa)
      AND (@IdSede IS NULL OR a.IdSede = @IdSede)
      AND (
            @Filtro = ''
            OR a.DNI LIKE '%' + @Filtro + '%'
            OR a.Nombres LIKE '%' + @Filtro + '%'
            OR a.Apellidos LIKE '%' + @Filtro + '%'
          );

    SELECT
        a.IdAlumno,
        a.DNI,
        a.Apellidos,
        a.Nombres,
        a.IdParamSexo,
        a.Dia,
        a.Mes,
        a.Anio,
        a.CarreraPostula,
        a.WhatsApp,
        a.IE_Procedencia AS IeProcedencia,
        a.IE_Ubigeo AS IeUbigeo,
        a.IdSede,
        a.IdUniversidad,
        a.IdUniversidadDetalle,
        a.IdCiclo,
        cic.Nombre AS NombreCiclo,
        s.Nombre AS NombreSede,
        s.IdEmpresa,
        e.Nombre AS NombreEmpresa,
        u.Nombre AS NombreUniversidad,
        ud.CarreraNombre AS NombreCarreraDetalle
    FROM dbo.Alumno AS a
    INNER JOIN dbo.Sedes AS s ON s.IdSede = a.IdSede
    INNER JOIN dbo.Empresas AS e ON e.IdEmpresa = s.IdEmpresa
    LEFT JOIN dbo.Ciclo AS cic ON cic.IdCiclo = a.IdCiclo
    LEFT JOIN dbo.Universidad AS u ON u.IdUniversidad = a.IdUniversidad
    LEFT JOIN dbo.UniversidadDetalle AS ud ON ud.IdDetalle = a.IdUniversidadDetalle
    WHERE (@IdEmpresa IS NULL OR s.IdEmpresa = @IdEmpresa)
      AND (@IdSede IS NULL OR a.IdSede = @IdSede)
      AND (
            @Filtro = ''
            OR a.DNI LIKE '%' + @Filtro + '%'
            OR a.Nombres LIKE '%' + @Filtro + '%'
            OR a.Apellidos LIKE '%' + @Filtro + '%'
          )
    ORDER BY a.Apellidos, a.Nombres
    OFFSET @Offset ROWS FETCH NEXT @P_PAGESIZE ROWS ONLY;
END

ALTER PROCEDURE [dbo].[MAC_SELECT_CARNET_LISTADO]
    @IdEmpresa INT,
    @IdSede INT = NULL,
    @P_FILTRO VARCHAR(200) = '',
    @P_PAGENUMBER INT = 1,
    @P_PAGESIZE INT = 20,
    @P_TOTALROWS INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Filtro VARCHAR(200) = LTRIM(RTRIM(ISNULL(@P_FILTRO, '')));
    DECLARE @Offset INT = (@P_PAGENUMBER - 1) * @P_PAGESIZE;

    /* Último registro de impresión/carnet por alumno (puede no existir fila en Carnet) */
    ;WITH UltCarnet AS
    (
        SELECT
            c.IdCarnet,
            c.IdAlumno,
            c.FechaInscripcion,
            c.FechaVencimiento,
            ROW_NUMBER() OVER (PARTITION BY c.IdAlumno ORDER BY c.IdCarnet DESC) AS rn
        FROM dbo.Carnet AS c
    )
    SELECT @P_TOTALROWS = COUNT(1)
    FROM dbo.Alumno AS a
    INNER JOIN dbo.Sedes AS s ON s.IdSede = a.IdSede
    INNER JOIN dbo.Empresas AS e ON e.IdEmpresa = s.IdEmpresa
    LEFT JOIN UltCarnet AS uc ON uc.IdAlumno = a.IdAlumno AND uc.rn = 1
    LEFT JOIN dbo.UniversidadDetalle AS ud ON ud.IdDetalle = a.IdUniversidadDetalle
    OUTER APPLY
    (
        SELECT TOP (1)
            cx.Nombre AS NombreCiclo
        FROM dbo.Ciclo AS cx
        WHERE cx.IdSede = a.IdSede
              AND cx.Activo = 1
        ORDER BY cx.FechaInicio DESC, cx.IdCiclo DESC
    ) AS cic
    WHERE s.IdEmpresa = @IdEmpresa
          AND (@IdSede IS NULL OR a.IdSede = @IdSede)
          AND (
                  @Filtro = ''
                  OR a.DNI LIKE '%' + @Filtro + '%'
                  OR a.Nombres LIKE '%' + @Filtro + '%'
                  OR a.Apellidos LIKE '%' + @Filtro + '%'
                  OR ISNULL(ud.CarreraNombre, a.CarreraPostula) LIKE '%' + @Filtro + '%'
              );

    ;WITH UltCarnet AS
    (
        SELECT
            c.IdCarnet,
            c.IdAlumno,
            c.FechaInscripcion,
            c.FechaVencimiento,
            ROW_NUMBER() OVER (PARTITION BY c.IdAlumno ORDER BY c.IdCarnet DESC) AS rn
        FROM dbo.Carnet AS c
    )
    SELECT
        uc.IdCarnet,
        a.IdAlumno,
        a.DNI,
        a.Apellidos,
        a.Nombres,
        COALESCE(ud.CarreraNombre, a.CarreraPostula) AS CarreraPostula,
        cic.NombreCiclo,
        uc.FechaVencimiento,
        uc.FechaInscripcion,
        a.FechaRegistro,
        e.Nombre AS NombreEmpresa,
        s.Nombre AS NombreSede,
        a.WhatsApp
    FROM dbo.Alumno AS a
    INNER JOIN dbo.Sedes AS s ON s.IdSede = a.IdSede
    INNER JOIN dbo.Empresas AS e ON e.IdEmpresa = s.IdEmpresa
    LEFT JOIN UltCarnet AS uc ON uc.IdAlumno = a.IdAlumno AND uc.rn = 1
    LEFT JOIN dbo.UniversidadDetalle AS ud ON ud.IdDetalle = a.IdUniversidadDetalle
    OUTER APPLY
    (
        SELECT TOP (1)
            cx.Nombre AS NombreCiclo
        FROM dbo.Ciclo AS cx
        WHERE cx.IdSede = a.IdSede
              AND cx.Activo = 1
        ORDER BY cx.FechaInicio DESC, cx.IdCiclo DESC
    ) AS cic
    WHERE s.IdEmpresa = @IdEmpresa
          AND (@IdSede IS NULL OR a.IdSede = @IdSede)
          AND (
                  @Filtro = ''
                  OR a.DNI LIKE '%' + @Filtro + '%'
                  OR a.Nombres LIKE '%' + @Filtro + '%'
                  OR a.Apellidos LIKE '%' + @Filtro + '%'
                  OR ISNULL(ud.CarreraNombre, a.CarreraPostula) LIKE '%' + @Filtro + '%'
              )
    ORDER BY a.Apellidos, a.Nombres
    OFFSET @Offset ROWS FETCH NEXT @P_PAGESIZE ROWS ONLY;
END
GO

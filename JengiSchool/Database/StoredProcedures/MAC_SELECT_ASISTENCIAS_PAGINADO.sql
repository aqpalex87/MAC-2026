ALTER PROCEDURE [dbo].[MAC_SELECT_ASISTENCIAS_PAGINADO]
    @IdEmpresa INT,
    @IdSede INT = NULL,
    @P_DNI VARCHAR(20) = '',
    @P_FECHA_INICIO DATE = NULL,
    @P_FECHA_FIN DATE = NULL,
    @P_IDPARAMEVENTO INT = NULL,
    @P_PAGENUMBER INT = 1,
    @P_PAGESIZE INT = 20,
    @P_TOTALROWS INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @DniFiltro VARCHAR(20) = LTRIM(RTRIM(ISNULL(@P_DNI, '')));
    DECLARE @Offset INT = (@P_PAGENUMBER - 1) * @P_PAGESIZE;

    SELECT @P_TOTALROWS = COUNT(1)
    FROM dbo.Asistencia AS asi
    INNER JOIN dbo.Alumno AS a ON a.IdAlumno = asi.IdAlumno
    INNER JOIN dbo.Sedes AS s ON s.IdSede = a.IdSede
    INNER JOIN dbo.Empresas AS e ON e.IdEmpresa = s.IdEmpresa
    LEFT JOIN dbo.Parametro AS p ON p.IdParametro = asi.IdParamEvento
    WHERE s.IdEmpresa = @IdEmpresa
      AND (@IdSede IS NULL OR a.IdSede = @IdSede)
      AND (@DniFiltro = '' OR a.DNI LIKE '%' + @DniFiltro + '%')
      AND (@P_IDPARAMEVENTO IS NULL OR asi.IdParamEvento = @P_IDPARAMEVENTO)
      AND (@P_FECHA_INICIO IS NULL OR CAST(asi.FechaHora AS DATE) >= @P_FECHA_INICIO)
      AND (@P_FECHA_FIN IS NULL OR CAST(asi.FechaHora AS DATE) <= @P_FECHA_FIN);

    SELECT
        asi.IdAsistencia,
        asi.IdParamEvento,
        ISNULL(p.Nombre, CONCAT('Evento ', asi.IdParamEvento)) AS Evento,
        CAST(asi.FechaHora AS DATE) AS Fecha,
        CONVERT(VARCHAR(8), asi.FechaHora, 108) AS Hora,
        ISNULL(NULLIF(LTRIM(RTRIM(asi.Sede)), ''), s.Nombre) AS Sede,
        c.Nombre AS Ciclo,
        a.DNI,
        a.Apellidos,
        a.Nombres,
        asi.Observacion
    FROM dbo.Asistencia AS asi
    INNER JOIN dbo.Alumno AS a ON a.IdAlumno = asi.IdAlumno
    INNER JOIN dbo.Sedes AS s ON s.IdSede = a.IdSede
	INNER JOIN dbo.Ciclo AS c ON c.IdCiclo =a.IdCiclo
    INNER JOIN dbo.Empresas AS e ON e.IdEmpresa = s.IdEmpresa
    LEFT JOIN dbo.Parametro AS p ON p.IdParametro = asi.IdParamEvento
    WHERE s.IdEmpresa = @IdEmpresa
      AND (@IdSede IS NULL OR a.IdSede = @IdSede)
      AND (@DniFiltro = '' OR a.DNI LIKE '%' + @DniFiltro + '%')
      AND (@P_IDPARAMEVENTO IS NULL OR asi.IdParamEvento = @P_IDPARAMEVENTO)
      AND (@P_FECHA_INICIO IS NULL OR CAST(asi.FechaHora AS DATE) >= @P_FECHA_INICIO)
      AND (@P_FECHA_FIN IS NULL OR CAST(asi.FechaHora AS DATE) <= @P_FECHA_FIN)
    ORDER BY asi.FechaHora DESC, asi.IdAsistencia DESC
    OFFSET @Offset ROWS FETCH NEXT @P_PAGESIZE ROWS ONLY;
END

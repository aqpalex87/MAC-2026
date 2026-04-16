CREATE PROCEDURE [dbo].[MAC_SELECT_APODERADOS_POR_ALUMNO]
    @IdAlumno INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        aa.IdAlumno,
        aa.IdApoderado,
        aa.Tipo,
        ap.DNI,
        ap.Nombre,
        ap.WhatsApp,
        ap.IdParamParentesco,
        p.Nombre AS NombreParentesco
    FROM dbo.AlumnoApoderado AS aa
    INNER JOIN dbo.Apoderado AS ap ON ap.IdApoderado = aa.IdApoderado
    LEFT JOIN dbo.Parametro AS p ON p.IdParametro = ap.IdParamParentesco
    WHERE aa.IdAlumno = @IdAlumno
    ORDER BY ap.Nombre;
END

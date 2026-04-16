CREATE PROCEDURE [dbo].[MAC_SELECT_ALUMNO_POR_ID]
    @IdAlumno INT
AS
BEGIN
    SET NOCOUNT ON;

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
        s.Nombre AS NombreSede,
        s.IdEmpresa,
        e.Nombre AS NombreEmpresa,
        u.Nombre AS NombreUniversidad,
        ud.CarreraNombre AS NombreCarreraDetalle
    FROM dbo.Alumno AS a
    INNER JOIN dbo.Sedes AS s ON s.IdSede = a.IdSede
    INNER JOIN dbo.Empresas AS e ON e.IdEmpresa = s.IdEmpresa
    LEFT JOIN dbo.Universidad AS u ON u.IdUniversidad = a.IdUniversidad
    LEFT JOIN dbo.UniversidadDetalle AS ud ON ud.IdDetalle = a.IdUniversidadDetalle
    WHERE a.IdAlumno = @IdAlumno;
END

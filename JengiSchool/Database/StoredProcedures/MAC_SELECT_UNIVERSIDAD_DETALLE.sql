CREATE PROCEDURE [dbo].[MAC_SELECT_UNIVERSIDAD_DETALLE]
    @IdUniversidad INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        d.IdDetalle,
        d.IdUniversidad,
        d.CarreraNombre,
        d.PuntajeMinimo,
        d.PuntajeMaximo,
        d.Anio
    FROM dbo.UniversidadDetalle d
    WHERE d.IdUniversidad = @IdUniversidad
    ORDER BY d.CarreraNombre;
END

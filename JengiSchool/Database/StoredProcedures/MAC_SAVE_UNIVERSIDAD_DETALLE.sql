ALTER PROCEDURE [dbo].[MAC_SAVE_UNIVERSIDAD_DETALLE]
    @IdUniversidad INT,
    @DetalleXml XML
AS
BEGIN


    DELETE FROM dbo.UniversidadDetalle
    WHERE IdUniversidad = @IdUniversidad;

    INSERT INTO dbo.UniversidadDetalle
    (
        IdUniversidad,
        CarreraNombre,
        PuntajeMinimo,
        PuntajeMaximo,
        Anio
    )
    SELECT
        @IdUniversidad,
        LTRIM(RTRIM(T.N.value('(CarreraNombre/text())[1]', 'VARCHAR(150)'))),
        NULLIF(T.N.value('(PuntajeMinimo/text())[1]', 'VARCHAR(50)'), ''),
        NULLIF(T.N.value('(PuntajeMaximo/text())[1]', 'VARCHAR(50)'), ''),
        NULLIF(T.N.value('(Anio/text())[1]', 'VARCHAR(10)'), '')
    FROM @DetalleXml.nodes('/root/d') AS T(N)
    WHERE LTRIM(RTRIM(T.N.value('(CarreraNombre/text())[1]', 'VARCHAR(150)'))) <> '';
END

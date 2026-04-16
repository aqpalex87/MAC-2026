CREATE PROCEDURE [dbo].[MAC_DELETE_ALUMNO]
    @IdAlumno INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PrevApoderados TABLE (IdApoderado INT);

    INSERT INTO @PrevApoderados (IdApoderado)
    SELECT aa.IdApoderado
    FROM dbo.AlumnoApoderado AS aa
    WHERE aa.IdAlumno = @IdAlumno;

    DELETE FROM dbo.AlumnoApoderado
    WHERE IdAlumno = @IdAlumno;

    DELETE FROM dbo.Apoderado
    WHERE IdApoderado IN (SELECT p.IdApoderado FROM @PrevApoderados AS p)
      AND NOT EXISTS
    (
        SELECT 1
        FROM dbo.AlumnoApoderado AS aa
        WHERE aa.IdApoderado = Apoderado.IdApoderado
    );

    DELETE FROM dbo.Alumno
    WHERE IdAlumno = @IdAlumno;
END

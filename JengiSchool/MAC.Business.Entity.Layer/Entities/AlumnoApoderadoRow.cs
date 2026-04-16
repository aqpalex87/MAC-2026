namespace MAC.Business.Entity.Layer.Entities
{
    public class AlumnoApoderadoRow
    {
        public int IdAlumno { get; set; }
        public int IdApoderado { get; set; }
        public int? Tipo { get; set; }
        public string DNI { get; set; }
        public string Nombre { get; set; }
        public string WhatsApp { get; set; }
        public int IdParamParentesco { get; set; }
        public string NombreParentesco { get; set; }
    }
}

namespace MAC.Business.Entity.Layer.Entities
{
    public class Alumno : Auditoria
    {
        public int IdAlumno { get; set; }
        public string DNI { get; set; }
        public string Apellidos { get; set; }
        public string Nombres { get; set; }
        public int? IdParamSexo { get; set; }
        public int? Dia { get; set; }
        public int? Mes { get; set; }
        public int? Anio { get; set; }
        public string CarreraPostula { get; set; }
        public string WhatsApp { get; set; }
        public string IeProcedencia { get; set; }
        public string IeUbigeo { get; set; }
        public int IdSede { get; set; }
        public int IdUniversidad { get; set; }
        public int IdUniversidadDetalle { get; set; }
        public string NombreSede { get; set; }
        public int IdEmpresa { get; set; }
        public string NombreEmpresa { get; set; }
        public string NombreUniversidad { get; set; }
        public string NombreCarreraDetalle { get; set; }
    }
}

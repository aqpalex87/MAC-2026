namespace MAC.Business.Entity.Layer.Entities
{
    public class Universidad : Auditoria
    {
        public int IdUniversidad { get; set; }
        public int IdEmpresa { get; set; }
        public string NombreEmpresa { get; set; }
        public string Nombre { get; set; }
    }
}

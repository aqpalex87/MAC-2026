using System;

namespace MAC.Business.Entity.Layer.Entities
{
    public class Ciclo : Auditoria
    {
        public int IdCiclo { get; set; }
        public string Nombre { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public bool Activo { get; set; }
        public int IdSede { get; set; }
        public string NombreSede { get; set; }
        public int IdEmpresa { get; set; }
        public string NombreEmpresa { get; set; }
    }
}

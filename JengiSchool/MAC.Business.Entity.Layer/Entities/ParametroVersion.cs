using System.Collections.Generic;

namespace MAC.Business.Entity.Layer.Entities
{
    public class ParametroVersion : Auditoria
    {
        public string CodigoVersion { get; set; }
        public string DescripcionVersion { get; set; }
        public decimal FechaUltimaActivacion { get; set; }
        public decimal HoraUltimaActivacion { get; set; }
        public decimal FechaUltimaInactivacion { get; set; }
        public decimal HoraUltimaInactivacion { get; set; }
        public string UsuarioUltimaActivacion { get; set; }
        public string UsuarioUltimaInactivacion { get; set; }
        public string Estado { get; set; }
        public List<ParametroGUF> ParametrosGUF { get; set; }
        public List<ParametroDPD> ParametrosDPD { get; set; }
        public List<ParametroDPI> ParametrosDPI { get; set; }
        public List<ParametroRatio> ParametrosRatio { get; set; }
        public List<ParametroTipoCliente> ParametrosTipoCliente { get; set; }
        public List<ParametroRSECondicion> ParametrosRSECondicion { get; set; }
        public List<ParametroComportamiento> ParametrosComportamiento { get; set; }
        public List<ParametroAlerta> ParametrosAlerta { get; set; }
        public List<ParametroESFA> ParametrosESFA { get; set; }

        public ParametroVersion()
        {
            ParametrosGUF = new List<ParametroGUF>();
            ParametrosDPD = new List<ParametroDPD>();
            ParametrosDPI = new List<ParametroDPI>();
            ParametrosRatio = new List<ParametroRatio>();
            ParametrosTipoCliente = new List<ParametroTipoCliente>();
            ParametrosRSECondicion = new List<ParametroRSECondicion>();
            ParametrosComportamiento = new List<ParametroComportamiento>();
            ParametrosAlerta = new List<ParametroAlerta>();
            ParametrosESFA = new List<ParametroESFA>();
        }
    }
}

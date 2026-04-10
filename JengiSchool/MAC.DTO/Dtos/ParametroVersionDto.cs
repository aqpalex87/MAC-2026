using System.Collections.Generic;

namespace MAC.DTO.Dtos
{
    public class ParametroVersionDto
    {
        public string CodigoVersion { get; set; }
        public string DescripcionVersion { get; set; }
        public string FechaUltimaActivacion { get; set; }
        public string FechaUltimaInactivacion { get; set; }
        public string FechaRegistro { get; set; }
        public string UsuarioRegistro { get; set; }
        public string UsuarioUltimaActivacion { get; set; }
        public string Estado { get; set; }
        public List<ParametroGUFDto> ParametrosGUF { get; set; }
        public List<ParametroDPDDto> ParametrosDPD { get; set; }
        public List<ParametroDPIDto> ParametrosDPI { get; set; }
        public List<ParametroRatioDto> ParametrosRatio { get; set; }
        public List<ParametroTipoClienteDto> ParametrosTipoCliente { get; set; }
        public List<ParametroRSECondicionDto> ParametrosRSECondicion { get; set; }
        public List<ParametroComportamientoDto> ParametrosComportamiento { get; set; }
        public List<ParametroAlertaDto> ParametrosAlerta { get; set; }
        public List<ParametroESFADto> ParametrosESFA { get; set; }

        public ParametroVersionDto()
        {
            ParametrosGUF = new List<ParametroGUFDto>();
            ParametrosDPD = new List<ParametroDPDDto>();
            ParametrosDPI = new List<ParametroDPIDto>();
            ParametrosRatio = new List<ParametroRatioDto>();
            ParametrosTipoCliente = new List<ParametroTipoClienteDto>();
            ParametrosRSECondicion = new List<ParametroRSECondicionDto>();
            ParametrosComportamiento = new List<ParametroComportamientoDto>();
            ParametrosAlerta = new List<ParametroAlertaDto>();
            ParametrosESFA = new List<ParametroESFADto>();
        }
    }
}

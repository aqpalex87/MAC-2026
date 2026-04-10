using MAC.Business.Entity.Layer;
using MAC.DTO.Dtos;
using System.Collections.Generic;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface ISolicitudCreditoService
    {
        SolicitudCreditoDto GetByNum(FilterSolicitudCreditoDto dto,string vista);
        List<SolicitudCreditoDto> ObtenerSolicitudesCredito(FilterSolicitudCreditoDto solicitud, UserJwt userJWT);
    }
}

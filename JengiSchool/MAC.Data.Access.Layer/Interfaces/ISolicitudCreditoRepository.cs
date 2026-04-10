using MAC.Business.Entity.Layer.Entities;
using System.Collections.Generic;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface ISolicitudCreditoRepository
    {
        SolicitudCredito GetByNum(SolicitudCredito solicitud, string vista);
        List<SolicitudCredito> ObtenerSolicitudesCredito(SolicitudCredito solicitud);
    }
}

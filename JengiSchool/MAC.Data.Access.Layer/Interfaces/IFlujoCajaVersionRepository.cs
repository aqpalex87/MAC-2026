using MAC.Business.Entity.Layer.Entities;
using System.Collections.Generic;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface IFlujoCajaRepository
    {
        bool EditarFlujoCaja(FlujoCajaMaster flujoCaja);
        decimal GuardarFlujoCaja(FlujoCajaMaster flujoCaja);
        FlujoCajaMaster GetFlujoCajaById(decimal idFC,string vista);
        bool ExistsFcByNroSolicitud(decimal nroSolicitud, string nroDoc);
        bool FinalizarFlujoCaja(FlujoCajaMaster flujoCaja);
        int GetCodEstado(decimal idFc);
        bool SaveCommentRevision(int idFc, string comment, string userName);
        (int codEstado, string estadoPropuesta) GetCodEstadoAndEstadoPropuesta(int idFc);
        decimal? GetIdFcLastCreditDesem(string nroDoc);
        FlujoCajaAnterior GetFcLastCreditDesem(decimal idFC);
        FlujoCajaAnterior GetFcLastCreditDesemCabecera(decimal idFC);
        List<FlujoCaja> ObtenerFlujosCaja(FlujoCaja solicitud);

        public List<string> GetYearsFromFC();
    }
}

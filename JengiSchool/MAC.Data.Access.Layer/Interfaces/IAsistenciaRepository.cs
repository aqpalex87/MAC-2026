using MAC.Business.Entity.Layer.Entities;
using System;
using System.Collections.Generic;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface IAsistenciaRepository
    {
        (List<AsistenciaListadoRow> Items, int TotalRows) ObtenerPaginado(
            int idEmpresa,
            int? idSede,
            string dni,
            DateTime? fechaInicio,
            DateTime? fechaFin,
            int? idParamEvento,
            int pageNumber,
            int pageSize);

        List<AsistenciaListadoRow> ObtenerParaExportar(
            int idEmpresa,
            int? idSede,
            string dni,
            DateTime? fechaInicio,
            DateTime? fechaFin,
            int? idParamEvento);

        int RegistrarManual(int idEmpresa, int? idSede, string dni, int idParamEvento, string observacion);
    }
}

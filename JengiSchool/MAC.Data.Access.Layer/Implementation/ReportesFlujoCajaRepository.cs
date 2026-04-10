using MAC.Business.Entity.Layer.Entities;
using MAC.Business.Entity.Layer.Utils;
using MAC.Data.Access.Layer.DB2;
using MAC.Data.Access.Layer.Extensions;
using MAC.Data.Access.Layer.Interfaces;
using MAC.DTO.Dtos;
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Threading;

namespace MAC.Data.Access.Layer.Implementation
{
    public class ReportesFlujoCajaRepository : IReportesFlujoCajaRepository
    {
        private readonly string cadenaConexion;

        public ReportesFlujoCajaRepository(DB2DataAccess db2Access)
        {
            cadenaConexion = db2Access.ObtConnectionStringSql();
        }

        //public GetConsultaFlujoCaja(FiltersReporteFlujoCajaDto filters)
        //{
        //    using iDB2Connection sqlConnection = new(cadenaConexion);
        //    using iDB2Command command = new("UP_MAC_SEL_REPORTE_FLUJO_CAJA_EXCEL", sqlConnection);
        //    command.CommandType = CommandType.StoredProcedure;
        //    command.Parameters.Add(new("P_ID_FLUJO_CAJA", iDB2DbType.iDB2Numeric) { Value = filters.idFC, Precision = 8 });
        //    command.Parameters.Add(new("P_ID_FLUJO_CAJA", iDB2DbType.iDB2Numeric) { Value = filters.idFC, Precision = 8 });
        //    command.Parameters.Add(new("P_ID_FLUJO_CAJA", iDB2DbType.iDB2Numeric) { Value = filters.idFC, Precision = 8 });
        //    command.Parameters.Add(new("P_ID_FLUJO_CAJA", iDB2DbType.iDB2Numeric) { Value = filters.idFC, Precision = 8 });
        //    command.Parameters.Add(new("P_ID_FLUJO_CAJA", iDB2DbType.iDB2Numeric) { Value = filters.idFC, Precision = 8 });
        //    command.Parameters.Add(new("P_ID_FLUJO_CAJA", iDB2DbType.iDB2Numeric) { Value = filters.idFC, Precision = 8 });
        //}

        public ReporteFlujoCajaMasterDto GetReporteFlujoCaja(FiltersReporteFlujoCajaDto filters)
        {
            try
            {
                using SqlConnection sqlConnection = new(cadenaConexion);
                using SqlCommand command = new("UP_MAC_SEL_REPORTE_FLUJO_CAJA_EXCEL", sqlConnection);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(new SqlParameter("P_ID_FLUJO_CAJA", SqlDbType.Decimal) { Value = filters.idFC, Precision = 8 });
                sqlConnection.Open();
                using SqlDataReader dataReader = command.ExecuteReader();

                var fCajaMaster = dataReader.GetEntity<ReporteFlujoCajaMasterDto>();//2

                if (fCajaMaster is null)
                    return fCajaMaster;
                dataReader.NextResult();

                var fcaja = dataReader.GetEntity<ReporteFlujoCajaDto>();//3e
                if (fcaja is null)
                    return fCajaMaster;

                fCajaMaster.ReporteFlujoCaja = fcaja;
                fCajaMaster.ReporteItemsFlujoCaja = dataReader.NextResult<ReporteItemFlujoCajaDto>();//1
                fCajaMaster.ReporteFlujoCaja.Guf = dataReader.NextResult<ReporteFlujoCajaGufDto>();//4
                fCajaMaster.ReporteFlujoCaja.Esfa = dataReader.NextResult<ReporteFlujoCajaEsfaDto>();//5
                fCajaMaster.ReporteFlujoCaja.Era = dataReader.NextResult<ReporteFlujoCajaEraDto>();//6
                fCajaMaster.ReporteFlujoCaja.Ratios = dataReader.NextResult<ReporteFlujoCajaRatioDto>();//7
                fCajaMaster.ReporteFlujoCaja.FCDetalle = dataReader.NextResult<ReporteFlujoCajaDetalleDto>();//8
                fCajaMaster.ReporteFlujoCaja.MontosPlazo = dataReader.NextResult<ReporteMontoPlazoDto>();//9
                fCajaMaster.ReporteFlujoCaja.Comentarios = dataReader.NextResult<ReporteFlujoCajaObsDto>();//10
                //SetValuesFC(fCajaMaster.ReporteFlujoCaja, comments.Select(c => (c.CodItem, c.Comentario)), GrupoItem.COMENTARIO);
                fCajaMaster.ReporteFlujoCaja.DeudaPD = dataReader.NextResult<ReporteFlujoCajaDpdDto>();//11
                fCajaMaster.ReporteFlujoCaja.DeudaPI = dataReader.NextResult<ReporteFlujoCajaDpiDto>();//12

                fCajaMaster.ReporteFlujoCaja.Rse = dataReader.NextResult<ReporteFLujoCajaRseDto>();//13
                //dataReader.NextResult();
                fCajaMaster.ReporteFlujoCaja.MontosRse = dataReader.NextResult<ReporteFLujoCajaMontosRseDto>();
                fCajaMaster.ReporteFlujoCaja.Comportamiento = dataReader.NextResult<ReporteFLujoCajaComportamientoDto>();
                fCajaMaster.ReporteFlujoCaja.Alertas = dataReader.NextResult<ReporteFLujoCajaAlertasDto>();

                //SetValuesFC(fCajaMaster.ReporteFlujoCaja.Rse, fCajaMaster.ReporteFlujoCaja.MontosPlazo.Select(c => (c.CodItem, c.Monto)), GrupoItem.RSE);

                //fcaja.HojaTrabajo = dataReader.NextResult<FlujoCajaHt>();
                //fcaja.PlanDR = dataReader.NextResult<FlujoCajaPdr>();

                //var comments = dataReader.NextResult<FlujoCajaObs>();
                //var montos = dataReader.NextResult<MontoPlazo>();
                //SetValuesFC(fcaja, comments.Select(c => (c.CodItem, c.Comentario)), GrupoItem.COMENTARIO);
                //if (fcaja.CodDestino == Destino.SOSTENIMIENTO)
                //{
                //    SetValuesFC(fcaja, montos.Select(c => (c.CodItem, c.Monto)), GrupoItem.SENSIBILIZACION);
                //    SetValuesFC(fcaja.Rse, montos.Select(c => (c.CodItem, c.Monto)), GrupoItem.RSE);
                //    SetDpd(fcaja, montos);
                //    SetDpi(fcaja, montos);
                //    SetOtrosCargos(fcaja, montos);
                //    SetMontosEnFcd(fcaja, montos);
                //}
                return fCajaMaster;
            }
            catch (Exception ex)
            { throw ex; }
        }

        static void SetValuesFC<E, T>(E entity, IEnumerable<(string, T)> values, string grupo)
        {
            var properties = entity.GetType().GetProperties();
            var query = from property in properties
                        where property.GetCustomAttribute<ItemAttribute>() != null
                        let codigo = property.GetCustomAttribute<ItemAttribute>().Codigo
                        where codigo[..3] == grupo && values.Any(c => c.Item1 == codigo)
                        let value = values.First(v => v.Item1 == codigo).Item2
                        select (property, value);
            foreach (var (property, value) in query)
            {
                property.SetValue(entity, value);
            }
        }

        static void SetMontosEnFcd(FlujoCajaMaster fc, IEnumerable<MontoPlazo> montos)
        {
            fc.FCDetalle.ForEach(d =>
            {
                d.MontosPlazo = montos.Where(m => m.CodItem == d.CodItem).ToList();
            });
        }

        static void SetDpd(FlujoCajaMaster fc, IEnumerable<MontoPlazo> montos)
        {
            fc.DeudaPD = montos.Where(m => m.CodItem[0..3] == GrupoItem.DEUDA_POTENCIAL_DIRECTA)
                            .Select(m => new FlujoCajaDpd
                            {
                                IdParametroDpd = m.CodItem,
                                MontoDeuda = m.Monto
                            }).ToList();
        }

        static void SetDpi(FlujoCajaMaster fc, IEnumerable<MontoPlazo> montos)
        {
            fc.DeudaPI = montos.Where(m => m.CodItem[0..3] == GrupoItem.DEUDA_POTENCIAL_INDIRECTA)
                            .Select(m => new FlujoCajaDpi
                            {
                                IdParametroDpi = m.CodItem,
                                Calificacion = m.CodClas,
                                MontoDeuda = m.Monto,
                            }).ToList();
        }

        static void SetOtrosCargos(FlujoCajaMaster fc, IEnumerable<MontoPlazo> montos)
        {
            fc.OtrosCargos = montos.Where(m => m.CodItem[0..3] == GrupoItem.OTROS_CARGOS)
                            .Select(m => new FlujoCajaOc
                            {
                                CodItem = m.CodItem,
                                Descripcion = m.Descripcion,
                                Tasa = (decimal)m.Tasa,
                                Monto = m.Monto,
                            }).ToList();
        }

        public FlujoCajaReporteDataDto GetReporteFlujoCajaPorRango(decimal inicio, decimal fin)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_SEL_FLUJO_CAJA_REPORTE", sqlConnection);
            command.Parameters.Add(new SqlParameter("P_INICIO", SqlDbType.Decimal) { Value = inicio, Precision = 8});
            command.Parameters.Add(new SqlParameter("P_FIN", SqlDbType.Decimal) { Value = fin, Precision = 8});
            command.CommandType = CommandType.StoredProcedure;
            sqlConnection.Open();

            using SqlDataReader dataReader = command.ExecuteReader();
            var flujoCajaReportes = dataReader.GetEntities<FlujoCajaReporteDto>();
            dataReader.NextResult();
            var flujoCajaEra = dataReader.GetEntities<FlujoCajaEraDto>();
            dataReader.NextResult();
            var flujoCajaEsfa = dataReader.GetEntities<FlujoCajaEsfaDto>();
            dataReader.NextResult();
            var flujoCajaDetalle = dataReader.GetEntities<FlujoCajaDetalleDto>();
            dataReader.NextResult();
            var flujoCajaRse = dataReader.GetEntities<FlujoCajaRseDto>();
            dataReader.NextResult();
            var flujoCajaDPD = dataReader.GetEntities<FlujoCajaDpdDto>();
            dataReader.NextResult();
            var flujoCajaDPI = dataReader.GetEntities<FlujoCajaDpiDto>();
            dataReader.NextResult();
            var flujoCajaReporteAnexoDetallePasivos = dataReader.GetEntities<FlujoCajaReporteAnexoDetallePasivoDto>();
            dataReader.NextResult();
            var flujoCajaReportePlanDesembolsos = dataReader.GetEntities<FlujoCajaReportePlanDesembolsoDto>();
            dataReader.NextResult();
            var flujoCajaRatios = dataReader.GetEntities<FlujoCajaRatioDto>();

            return new FlujoCajaReporteDataDto()
            {
                FlujoCajaReportes = flujoCajaReportes,
                FlujoCajaReporteAnexoDetallePasivos = flujoCajaReporteAnexoDetallePasivos,
                FlujoCajaReportePlanDesembolsos = flujoCajaReportePlanDesembolsos,
                FlujoCajaDetalle = flujoCajaDetalle,
                FlujoCajaEsfa = flujoCajaEsfa,
                FlujoCajaEra = flujoCajaEra,
                FlujoCajaRse = flujoCajaRse,
                FlujoCajaDPD = flujoCajaDPD,
                FlujoCajaDPI = flujoCajaDPI,
                FlujoCajaRatio = flujoCajaRatios
            };
        }
    }
}

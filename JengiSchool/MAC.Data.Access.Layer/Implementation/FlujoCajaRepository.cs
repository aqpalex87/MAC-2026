using MAC.Business.Entity.Layer.Entities;
using MAC.Business.Entity.Layer.Utils;
using MAC.Data.Access.Layer.DB2;
using MAC.Data.Access.Layer.Extensions;
using MAC.Data.Access.Layer.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using Microsoft.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Reflection;
using System.Text.Json;

namespace MAC.Data.Access.Layer.Implementation
{
    public class FlujoCajaRepository : IFlujoCajaRepository
    {
        private readonly string cadenaConexion;
        private const string PAMETRO_IDFC = "P_IDFC";

        public FlujoCajaRepository(DB2DataAccess db2Access)
        {
            cadenaConexion = db2Access.ObtConnectionStringSql();
        }

        public decimal GuardarFlujoCaja(FlujoCajaMaster flujoCaja)
        {
            try
            {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_PRO_GUARDAR_FC", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;


                var parametros = new List<SqlParameter>
            {
                new SqlParameter("P_NEWIDFC", SqlDbType.Decimal) { Value= flujoCaja.IdFC, Precision = 8 },
                new SqlParameter("P_FLCNSCN", SqlDbType.Decimal) { Value = flujoCaja.NroSolicitud, Precision = 12 },
                new SqlParameter("P_CODDESTINO", SqlDbType.Char, 4) { Value = flujoCaja.CodDestino },
                new SqlParameter("P_FLCNDOA", SqlDbType.Char, 15) { Value = flujoCaja.NroDocumento },
                new SqlParameter("P_FLCCVPA", SqlDbType.Char, 8) { Value = flujoCaja.CodVerParametro },
                new SqlParameter("P_FLCPACA", SqlDbType.Decimal) { Value = flujoCaja.PeriodoActual, Precision = 6 },
                new SqlParameter("P_FLCPFCA", SqlDbType.Decimal) { Value = flujoCaja.PeriodoFC, Precision = 6 },
                new SqlParameter("P_FLCPFCN", SqlDbType.Char, 6) { Value = flujoCaja.IdProductoFC.ToStringParameter()},
            };

                parametros.AddRange(GetComunParams(flujoCaja));
                command.Parameters.AddRange(parametros.ToArray());
                sqlConnection.Open();
                command.ExecuteNonQuery();
                var idFC = (decimal)command.Parameters["P_NEWIDFC"].Value;
                return idFC;
            }
            catch (Exception ex)
            { throw ex; }

        }

        public FlujoCajaAnterior GetFcLastCreditDesemCabecera(decimal idFC)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_SEL_DATOS_FC_ULTIMO_CREDITO_DESEM", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter(PAMETRO_IDFC, SqlDbType.Decimal) { Value = idFC, Precision = 8 });
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            var fcaja = dataReader.GetEntity<FlujoCajaAnterior>();
            return fcaja;
        }


        public bool EditarFlujoCaja(FlujoCajaMaster flujoCaja)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_PRO_EDITAR_FC", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;

            var parametros = new List<SqlParameter>
            {
                new SqlParameter("P_FLCIDMN", SqlDbType.Decimal) { Value = flujoCaja.IdFC, Precision = 8 },
                new SqlParameter("P_CODDESTINO", SqlDbType.Char, 4) { Value = flujoCaja.CodDestino },
            };

            parametros.AddRange(GetComunParams(flujoCaja));

            command.Parameters.AddRange(parametros.ToArray());
            sqlConnection.Open();
            command.ExecuteNonQuery();
            return true;
        }

        public bool FinalizarFlujoCaja(FlujoCajaMaster flujoCaja)
        {
            try
            {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_PRO_FINALIZAR_FC", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;

            var parametros = new List<SqlParameter>
            {
                new SqlParameter(PAMETRO_IDFC, SqlDbType.Decimal) { Value = flujoCaja.IdFC, Precision = 8 },
                new SqlParameter("P_USER", SqlDbType.Char, 10) { Value = "test" },
            };

            command.Parameters.AddRange(parametros.ToArray());
            sqlConnection.Open();
            command.ExecuteNonQuery();
            return true;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public bool SaveCommentRevision(int idFc, string comment, string userName)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_PRO_REGISTRAR_OBS_FC", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;

            var parametros = new List<SqlParameter>
            {
              new SqlParameter(PAMETRO_IDFC, SqlDbType.Decimal) { Value = idFc, Precision = 8 },
              new SqlParameter("P_USER", SqlDbType.Char, 10) { Value = userName },
              new SqlParameter("P_COMMENT", SqlDbType.VarChar, 255) { Value = comment },
            };

            command.Parameters.AddRange(parametros.ToArray());
            sqlConnection.Open();
            command.ExecuteNonQuery();
            return true;
        }

        public int GetCodEstado(decimal idFc)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_GET_ESTADO_FC", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.Add(new SqlParameter(PAMETRO_IDFC, SqlDbType.Decimal) { Value = idFc, Precision = 8 });
            sqlConnection.Open();
            var codEstado = Convert.ToInt32(command.ExecuteScalar());
            return codEstado;
        }

        public (int codEstado, string estadoPropuesta) GetCodEstadoAndEstadoPropuesta(int idFc)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_GET_ESTADO_FC_Y_ESTADO_PROPUESTA", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.Add(new SqlParameter(PAMETRO_IDFC, SqlDbType.Decimal) { Value = idFc, Precision = 8 });
            sqlConnection.Open();
            var reader = command.ExecuteReader(CommandBehavior.SingleRow);
            int codEstado = 0;
            string estadoPropuesta = string.Empty;
            while (reader.Read())
            {
                codEstado = reader.GetInt32("ESTADOFLUJOCAJA");
                estadoPropuesta = reader.GetString("ESTADOPROPUESTA");
            }
            return (codEstado, estadoPropuesta);
        }

        public decimal? GetIdFcLastCreditDesem(string nroDoc)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_SEL_IDFC_ULTIMO_CREDITO_DESEM", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("P_NRO_DOC", SqlDbType.Char, 15) { Value = nroDoc });
            sqlConnection.Open();
            var idFC = (decimal?)command.ExecuteScalar();
            return idFC;
        }

        private static IList<SqlParameter> GetComunParams(FlujoCajaMaster flujoCaja)
        {
            var montosGenerales = flujoCaja.Rse is null ? "[]" : MontoGenerales(flujoCaja).ToJson();
            var parametros = new List<SqlParameter>
            {
                new SqlParameter("P_FLCMTAN", SqlDbType.Decimal) { Value = flujoCaja.MontoTotalFinanciar, Precision = 15, Scale = 2 },
                new SqlParameter("P_FLCUREA", SqlDbType.Char, 10) { Value = flujoCaja.UsuarioRegistro },
                new SqlParameter("P_JSON_GUF", SqlDbType.VarChar, Limites.MaxJsonLengthGUF) { Value = flujoCaja.Guf.ToJson() },
                new SqlParameter("P_JSON_ESFA", SqlDbType.VarChar, Limites.MaxJsonLengthESFA) { Value = flujoCaja.Esfa.ToJson() },
                new SqlParameter("P_JSON_ERA", SqlDbType.VarChar, Limites.MaxJsonLengthERA) { Value = flujoCaja.Era.ToJson() },
                new SqlParameter("P_JSON_FCD", SqlDbType.NVarChar, Limites.MaxJsonLengthFCD) { Value = flujoCaja.FCDetalle.ToJson() },
                new SqlParameter("P_JSON_PDR", SqlDbType.VarChar, Limites.MaxJsonLengthPDR) { Value = flujoCaja.PlanDR.ToJson() },
                new SqlParameter("P_JSON_RSE", SqlDbType.VarChar, Limites.MaxJsonLengthRSE) { Value = JsonSerializer.Serialize(flujoCaja.Rse) },
                new SqlParameter("P_JSON_HTB", SqlDbType.VarChar, Limites.MaxJsonLengthHTB) { Value = flujoCaja.HojaTrabajo.ToJson() },
                new SqlParameter("P_JSON_COM", SqlDbType.VarChar, Limites.MaxJsonLengthCOM) { Value = ListComents(flujoCaja).ToJson()},
                new SqlParameter("P_JSON_MOG", SqlDbType.NVarChar, Limites.MaxJsonLengthMOG) { Value = montosGenerales },
            };
            return parametros;

        }

        private static IList<FlujoCajaObs> ListComents(FlujoCajaMaster flujoCaja)
        {
            var properties = flujoCaja.GetType().GetProperties();
            var query = from property in properties
                        where property.GetCustomAttribute<ItemAttribute>() != null
                        let codigo = property.GetCustomAttribute<ItemAttribute>().Codigo
                        where codigo[..3] == GrupoItem.COMENTARIO
                        let value = (property.GetValue(flujoCaja) ?? "") as string
                        select new FlujoCajaObs { CodItem = codigo, Comentario = value };
            return query.ToList();
        }

        private static IEnumerable<MontoPlazo> MontoGenerales(FlujoCajaMaster flujoCaja)
        {
            var dpd = MontosPlazoDpd(flujoCaja);
            var dpi = MontosPlazoDpi(flujoCaja);
            var sensi = MontosPlazo(flujoCaja, GrupoItem.SENSIBILIZACION);
            var rse = MontosPlazo(flujoCaja.Rse, GrupoItem.RSE);
            var ot = MontosPlazoOtrosCargos(flujoCaja);
            var hp = MontosFlujoCajaHP(flujoCaja);
            var mpfcd = MontosPlazoFcd(flujoCaja);
            return new List<MontoPlazo>(dpd).Concat(dpi).Concat(sensi)
                                            .Concat(rse).Concat(ot).Concat(hp).Concat(mpfcd);
        }

        private static IList<MontoPlazo> MontosPlazoFcd(FlujoCajaMaster flujoCaja)
        {
            return flujoCaja.FCDetalle.SelectMany(fcd =>
            {
                fcd.MontosPlazo.ForEach(mp => mp.CodItem = fcd.CodItem);
                return fcd.MontosPlazo;
            }).ToList();
        }
        private static IList<MontoPlazo> MontosPlazoOtrosCargos(FlujoCajaMaster flujoCaja)
        {
            return flujoCaja.OtrosCargos.Select(p => new MontoPlazo
            {
                CodItem = p.CodItem,
                Tasa = p.Tasa,
                Monto = p.Monto
            }).ToList();
        }

        private static IList<MontoPlazo> MontosFlujoCajaHP(FlujoCajaMaster flujoCaja)
        {
            return flujoCaja.FlujoCajaHP.Select(p => new MontoPlazo
            {
                CodItem = p.CodItem,
                Descripcion = p.Descripcion,
                Monto = p.Monto
            }).ToList();
        }

        private static IList<MontoPlazo> MontosPlazo<T>(T entidad, string grupo)
        {
            var properties = entidad.GetType().GetProperties();
            var query = from property in properties
                        where property.GetCustomAttribute<ItemAttribute>() != null
                        let codigo = property.GetCustomAttribute<ItemAttribute>().Codigo
                        where codigo[..3] == grupo
                        let value = (decimal)property.GetValue(entidad)
                        select new MontoPlazo { CodItem = codigo, Monto = value };
            return query.ToList();
        }

        private static IList<MontoPlazo> MontosPlazoDpd(FlujoCajaMaster flujoCaja)
        {
            return flujoCaja.DeudaPD.Select(p => new MontoPlazo
            {
                CodItem = p.IdParametroDpd,
                Monto = p.MontoDeuda,
            }).ToList();
        }

        private static IList<MontoPlazo> MontosPlazoDpi(FlujoCajaMaster flujoCaja)
        {
            return flujoCaja.DeudaPI.Select(p => new MontoPlazo
            {
                CodItem = p.IdParametroDpi,
                Monto = p.MontoDeuda,
                CodClas = p.Calificacion
            }).ToList();
        }

        public FlujoCajaMaster GetFlujoCajaById(decimal idFC, string vista)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_SEL_DATOS_FC", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("P_FLCIDMN", SqlDbType.Decimal) { Value = idFC, Precision = 8 });
            command.Parameters.Add(new SqlParameter("P_VISTA", SqlDbType.Char, 2) { Value = vista.ToStringParameter() });
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();

            FlujoCajaMaster fcaja = null;
            if (vista.Equals("FC"))
            {
                fcaja = dataReader.GetEntity<FlujoCajaMaster>();
                dataReader.NextResult();
            }
            else
            {
                dataReader.NextResult();
                fcaja = dataReader.GetEntity<FlujoCajaMaster>();

            }

            if (fcaja is null)
            {
                return fcaja;
            }
            SetPropertiesFC(dataReader, fcaja);
            var comments = dataReader.NextResult<FlujoCajaObs>();
            var montos = dataReader.NextResult<MontoPlazo>();
            SetValuesFC(fcaja, comments.Select(c => (c.CodItem, c.Comentario)), GrupoItem.COMENTARIO);
            if (fcaja.CodDestino == Destino.SOSTENIMIENTO)
            {
                SetValuesFC(fcaja, montos.Select(c => (c.CodItem, c.Monto)), GrupoItem.SENSIBILIZACION);
                SetValuesFC(fcaja.Rse, montos.Select(c => (c.CodItem, c.Monto)), GrupoItem.RSE);
                SetDpd(fcaja, montos);
                SetDpi(fcaja, montos);
                SetOtrosCargos(fcaja, montos);
                SetMontosEnFcd(fcaja, montos);
                SetFlujoCajaHP(fcaja, montos);
            }
            return fcaja;
        }

        private static void SetPropertiesFC(DbDataReader dataReader, FlujoCajaMaster fcaja)
        {
            fcaja.Guf = dataReader.NextResult<FlujoCajaGuf>();
            fcaja.Ratios = dataReader.NextResult<FlujoCajaRatio>();
            fcaja.Esfa = dataReader.NextResult<FlujoCajaEsfa>();
            fcaja.Era = dataReader.NextResult<FlujoCajaEra>();
            fcaja.FCDetalle = dataReader.NextResult<FlujoCajaDetalle>();
            fcaja.Rse = dataReader.NextResultEntity<FlujoCajaRse>();
            fcaja.HojaTrabajo = dataReader.NextResult<FlujoCajaHt>();
            fcaja.PlanDR = dataReader.NextResult<FlujoCajaPdr>();
        }

        public FlujoCajaAnterior GetFcLastCreditDesem(decimal idFC)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_SEL_DATOS_FC_ULTIMO_CREDITO_DESEM", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter(PAMETRO_IDFC, SqlDbType.Decimal) { Value = idFC, Precision = 8 });
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            var fcaja = dataReader.GetEntity<FlujoCajaAnterior>();
            if (fcaja is null)
            {
                return fcaja;
            }
            fcaja.Guf = dataReader.NextResult<FlujoCajaGuf>();
            fcaja.Ratios = dataReader.NextResult<FlujoCajaRatio>();
            fcaja.Esfa = dataReader.NextResult<FlujoCajaEsfa>();
            fcaja.Era = dataReader.NextResult<FlujoCajaEra>();
            fcaja.ItemsFcd = dataReader.NextResult<FlujoCajaDetalle>();
            SetOtrosCargos(fcaja, fcaja.ItemsFcd);
            return fcaja;
        }

        public bool ExistsFcByNroSolicitud(decimal nroSolicitud, string nroDoc)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_EXISTE_FC_CON_SC", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add(new SqlParameter("P_NRO_SOLICITUD", SqlDbType.Decimal) { Value = nroSolicitud, Precision = 12 });
            command.Parameters.Add(new SqlParameter("P_NRO_DOC", SqlDbType.Char, 15) { Value = nroDoc.ToStringParameter() });
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader(CommandBehavior.SingleRow);
            return dataReader.HasRows;
        }

        public List<FlujoCaja> ObtenerFlujosCaja(FlujoCaja solicitud)
        {
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new($"UP_MAC_SEL_SOLICITUDES_CREDITO_FLUJO_CAJA", sqlConnection);
            var parametros = new List<SqlParameter>
                {
                    new SqlParameter("P_ID_FLUJO_CAJA", SqlDbType.Decimal) { Value = solicitud.IdFlujoCaja, Precision = 8},
                    new SqlParameter("P_NUMERO_SOLICITUD", SqlDbType.Decimal) { Value = solicitud.NumeroSolicitud, Precision = 12},
                    new SqlParameter("P_NUMERO_DOCUMENTO", SqlDbType.VarChar, 15) { Value = solicitud.NumeroDocumento.ToStringParameter() },
                    new SqlParameter("P_NOMBRES", SqlDbType.VarChar, 153) { Value = solicitud.Nombres.ToStringParameter() },
                    new SqlParameter("P_NUMERO_CREDITO", SqlDbType.Decimal) { Value = solicitud.NumeroCredito, Precision = 12 },
                    new SqlParameter("P_ESTADO_FC", SqlDbType.VarChar, 1) { Value = solicitud.EstadoFlujoCaja.ToStringParameter() }
                };
            command.Parameters.AddRange(parametros.ToArray());
            command.CommandType = CommandType.StoredProcedure;
            command.CommandTimeout = 180;

            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            return dataReader.GetEntities<FlujoCaja>();
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

        static void SetFlujoCajaHP(FlujoCajaMaster fc, IEnumerable<MontoPlazo> montos)
        {
            fc.FlujoCajaHP = montos.Where(m => m.CodItem[0..2] == GrupoItem.HOJA_PRODUCTO)
                            .Select(m => new FlujoCajaHP
                            {
                                CodItem = m.CodItem,
                                Descripcion = m.Descripcion,
                                Monto = m.Monto,
                            }).ToList();
        }

        static void SetOtrosCargos(FlujoCajaAnterior fc, IEnumerable<FlujoCajaDetalle> montos)
        {
            fc.ItemsOc = montos.Where(m => m.CodItem[0..3] == GrupoItem.OTROS_CARGOS)
                            .Select(m => new FlujoCajaOc
                            {
                                CodItem = m.CodItem,
                                Descripcion = m.Descripcion,
                                Tasa = (decimal)m.Tasa
                            }).ToList();
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


        public List<string> GetYearsFromFC()
        {
            List<string> anios = new();
            using SqlConnection sqlConnection = new(cadenaConexion);
            using SqlCommand command = new("UP_MAC_SEL_YEARS_FC", sqlConnection);
            command.CommandType = CommandType.StoredProcedure;
            sqlConnection.Open();
            using SqlDataReader dataReader = command.ExecuteReader();
            while (dataReader.Read())
            {
                anios.Add(dataReader["Code"].ToString());
            };

            if (anios.Count == 0)
            {
                anios.Add(DateTime.Now.Year.ToString());
            }

            return anios;
        }


    }
}

using MAC.Business.Entity.Layer;
using MAC.Business.Entity.Layer.Entities;
using MAC.Business.Entity.Layer.Interfaces;
using MAC.Business.Entity.Layer.Utils;
using MAC.Business.Logic.Layer.Interfaces;
using MAC.Data.Access.Layer.Extensions;
using MAC.Data.Access.Layer.Implementation;
using MAC.Data.Access.Layer.Interfaces;
using MAC.DTO;
using MAC.DTO.Dtos;
using AutoMapper;
using DocumentFormat.OpenXml.Office2013.Drawing.ChartStyle;

using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using static ClosedXML.Excel.XLPredefinedFormat;

namespace MAC.Business.Logic.Layer.Implementation
{
    public class FlujoCajaService : IFlujoCajaService
    {
        private readonly IFlujoCajaRepository _fcRepository;
        private readonly ISolicitudCreditoRepository _solicitudCreditoRepository;
        private readonly IItemFlujoCajaRepository _itFcRepository;
        private readonly ILaserficheRepository _laserficheRepository;
        private readonly IParametroVersionRepository _parametroVersionRepository;
        private readonly IMapper _mapper;

        public FlujoCajaService(IFlujoCajaRepository fcRepository,
                                IMapper mapper,
                                IItemFlujoCajaRepository itFcRepository,
                                ILaserficheRepository laserficheRepository,
                                ISolicitudCreditoRepository solicitudCreditoRepository,
                                IParametroVersionRepository parametroVersionRepository)

        {
            _fcRepository = fcRepository;
            _mapper = mapper;
            _itFcRepository = itFcRepository;
            _laserficheRepository = laserficheRepository;
            _solicitudCreditoRepository = solicitudCreditoRepository;
            _parametroVersionRepository = parametroVersionRepository;

        }

        public Result<FlujoCajaMasterDto> GuardarFlujoCaja(FlujoCajaMasterRequestDto fcDto, UserJwt userJWT)
        {
            var existeFC = _fcRepository.ExistsFcByNroSolicitud(fcDto.NroSolicitud, fcDto.NroDocumento);
            var result = new Result<FlujoCajaMasterDto>();
            if (existeFC)
            {
                result.BadRequest($"La solicitud N° {fcDto.NroSolicitud} ya tiene un Flujo de Caja asociado.");
                return result;
            }

            VerificarArchivoLaserFiche(fcDto);

            var flujoCaja = _mapper.Map<FlujoCajaMaster>(fcDto);
            flujoCaja.UsuarioRegistro = userJWT.CodUsuario;

            if (flujoCaja.Guf.ToJson().Length > Limites.MaxJsonLengthGUF)
            {
                result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                return result;
            }
            if (flujoCaja.Esfa.ToJson().Length > Limites.MaxJsonLengthESFA)
            {
                result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                return result;
            }
            if (flujoCaja.Era.ToJson().Length > Limites.MaxJsonLengthERA)
            {
                result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                return result;
            }
            if (flujoCaja.FCDetalle.ToJson().Length > Limites.MaxJsonLengthFCD)
            {
                result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                return result;
            }
            if (flujoCaja.PlanDR.ToJson().Length > Limites.MaxJsonLengthPDR)
            {
                result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                return result;
            }
            if (JsonSerializer.Serialize(flujoCaja.Rse).Length > Limites.MaxJsonLengthRSE)
            {
                result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                return result;
            }
            if (flujoCaja.HojaTrabajo.ToJson().Length > Limites.MaxJsonLengthHTB)
            {
                result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                return result;
            }
            if (ListComents(flujoCaja).ToJson().Length > Limites.MaxJsonLengthCOM)
            {
                result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                return result;
            }

            EstablecerDatosCabeceraFC(fcDto, flujoCaja, "FC");

            var newIdFc = _fcRepository.GuardarFlujoCaja(flujoCaja);
            result.Resultado = GetFlujoCajaById(newIdFc, string.Empty, 0, "FC").Resultado;
            return result;
        }

        private void VerificarArchivoLaserFiche(FlujoCajaMasterRequestDto fcDto)
        {

            if (fcDto.HojaTrabajo?.Any() ?? false)
            {
                if (fcDto.HojaTrabajo[0].ArchivoBytes != null)
                {
                    var strJsonBodyLaserfiche = Newtonsoft.Json.JsonConvert.SerializeObject(
                        new
                        {
                            Nombre = fcDto.HojaTrabajo[0].Nombre,
                            Extension = fcDto.HojaTrabajo[0].Extension,
                            ArchivoBytes = fcDto.HojaTrabajo[0].ArchivoBytes
                        });
                    var strJsonLaserfiche = _laserficheRepository.ConsultarServicio(Endpoints.SAVE, strJsonBodyLaserfiche);
                    var laserficheResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<LaserficheResponse>(strJsonLaserfiche);
                    fcDto.HojaTrabajo[0].CodigoLaserfiche = laserficheResponse.Data.CodigoLaserfiche;
                    fcDto.HojaTrabajo[0].IdLaserfiche = laserficheResponse.Data.CodigoLaserfiche;
                }
            }
        }

        private void EstablecerDatosCabeceraFC(FlujoCajaMasterRequestDto fcDto, FlujoCajaMaster flujoCaja, string vista)
        {
            var solicitudCreditoFiltro = new SolicitudCredito
            {
                NumeroDocumento = fcDto.NroDocumento,
                NumeroSolicitud = fcDto.NroSolicitud
            };
            var solicitudCredito = _solicitudCreditoRepository.GetByNum(solicitudCreditoFiltro, vista);
            flujoCaja.CantidadFinanciar = solicitudCredito.MontoSolicitado;
            flujoCaja.HPPrecio = solicitudCredito.HPPrecio;
            flujoCaja.HPRendimiento = solicitudCredito.HPRendimiento;
            flujoCaja.Agencia = solicitudCredito.Agencia;
            flujoCaja.CodDestino = solicitudCredito.CodDestino;
            flujoCaja.CodEstado = EstadoFC.PENDIENTE.ToString();

            var parametroActual = _parametroVersionRepository.ObtenerParametroVersionActivo((int)flujoCaja.IdFC);
            if (parametroActual is not null)
            {
                flujoCaja.CodVerParametro = parametroActual.CodigoVersion;
            }
            flujoCaja.Destino = solicitudCredito.Destino;
            flujoCaja.HPCosto = solicitudCredito.HPCosto;
            flujoCaja.MontoTotalFinanciar = solicitudCredito.MontoSolicitado + ObtenerMontoOtrosCargos(fcDto.OtrosCargos) ?? 0;
            flujoCaja.OficialNegocio = solicitudCredito.Funcionario;
            flujoCaja.PeriodoActual = decimal.Parse(System.DateTime.Now.ToString("yyyyMM"));
            flujoCaja.PeriodoFC = 0;
            flujoCaja.IdProductoFC = string.Empty;
            var idFCLast = GetIdFcLastCreditDesem(fcDto.NroDocumento?.Trim() ?? string.Empty);
            if (idFCLast is not null)
            {
                var ultimoFC = _fcRepository.GetFcLastCreditDesemCabecera(idFCLast.Value);
                flujoCaja.PeriodoFC = ultimoFC.PeriodoActual;
                flujoCaja.IdProductoFC = ultimoFC.IdProductoFC ?? string.Empty;
            }
        }

        public decimal? ObtenerMontoOtrosCargos(List<FlujoCajaOcDto> otrosCargos)
        {
            decimal? montoTotal = 0;
            if (otrosCargos is not null && otrosCargos.Any())
            {
                foreach (var otroCargo in otrosCargos)
                {
                    montoTotal += otroCargo.Monto;
                }
            }
            return montoTotal;
        }


        public Result<bool> EditarFlujoCaja(FlujoCajaMasterRequestDto fcDto, UserJwt userJWT)
        {
            try
            {
                
                var result = new Result<bool>();
                if (fcDto.HojaTrabajo != null)
                {
                    VerificarArchivoLaserFiche(fcDto);
                }
                var estadoFC = _fcRepository.GetCodEstado(fcDto.IdFC.Value);
                var flujoCaja = _mapper.Map<FlujoCajaMaster>(fcDto);

                if (estadoFC == EstadoFC.NO_FOUND)
                {
                    return result.BadRequest(FlujoCajaMsg.NO_ENCONTRADO);
                }
                if (estadoFC == EstadoFC.FINALIZADO)
                {
                    return result.BadRequest(FlujoCajaMsg.FINALIZADO);
                }
                if (estadoFC is EstadoFC.OBSERVADO)
                {
                    _fcRepository.FinalizarFlujoCaja(flujoCaja);
                }

                if (flujoCaja.Guf.ToJson().Length > Limites.MaxJsonLengthGUF)
                {
                    result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                    return result;
                }
                if (flujoCaja.Esfa.ToJson().Length > Limites.MaxJsonLengthESFA)
                {
                    result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                    return result;
                }
                if (flujoCaja.Era.ToJson().Length > Limites.MaxJsonLengthERA)
                {
                    result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                    return result;
                }
                if (flujoCaja.FCDetalle.ToJson().Length > Limites.MaxJsonLengthFCD)
                {
                    result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                    return result;
                }
                if (flujoCaja.PlanDR.ToJson().Length > Limites.MaxJsonLengthPDR)
                {
                    result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                    return result;
                }
                if (JsonSerializer.Serialize(flujoCaja.Rse).Length > Limites.MaxJsonLengthRSE)
                {
                    result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                    return result;
                }
                if (flujoCaja.HojaTrabajo.ToJson().Length > Limites.MaxJsonLengthHTB)
                {
                    result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                    return result;
                }
                if (ListComents(flujoCaja).ToJson().Length > Limites.MaxJsonLengthCOM)
                {
                    result.BadRequest($"La información total del flujo de caja excede el tamaño máximo permitido");
                    return result;
                }

                flujoCaja.UsuarioRegistro = userJWT.CodUsuario;
                result.Resultado = _fcRepository.EditarFlujoCaja(flujoCaja);
                return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
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



        public Result<bool> FinalizarFlujoCaja(int idFc, UserJwt userJWT)
        {
            var result = new Result<bool>();
            var estadoFC = _fcRepository.GetCodEstado(idFc);
            if (estadoFC == EstadoFC.NO_FOUND)
            {
                return result.BadRequest(FlujoCajaMsg.NO_ENCONTRADO);
            }
            if (estadoFC == EstadoFC.FINALIZADO)
            {
                return result.BadRequest(FlujoCajaMsg.FINALIZADO);
            }
            var fc = new FlujoCajaMaster { IdFC = idFc };
            fc.UsuarioRegistro = userJWT.CodUsuario;
            result.Resultado = _fcRepository.FinalizarFlujoCaja(fc);
            return result;
        }

        public Result<bool> SaveCommentRevision(int idFc, string comment, UserJwt userJWT)
        {
            var result = new Result<bool>();
            var (estadoFC, estadoPropuesta) = _fcRepository.GetCodEstadoAndEstadoPropuesta(idFc);
            if (estadoFC == EstadoFC.NO_FOUND)
            {
                return result.BadRequest(FlujoCajaMsg.NO_ENCONTRADO);
            }
            if (estadoFC is not EstadoFC.FINALIZADO)
            {
                return result.BadRequest("Solo se puede registrar una observación de un FC con estado Finalizado.");
            }
            if (EstadoSC.IsDesembolsado(estadoPropuesta))
            {
                return result.BadRequest("El estado propuesta de la Solicitud de Crédito es Desembolsado.");
            }

            result.Resultado = _fcRepository.SaveCommentRevision(idFc, comment, userJWT.CodUsuario);
            return result;
        }

        public Result<FlujoCajaMasterDto> GetFlujoCajaById(decimal idFC, string nroDocumento, decimal nroSolicitud, string vista)
        {
            if (idFC > 0)
            {
                return GetFlujoCajaExistente(idFC, vista);
            }

            var result = new Result<FlujoCajaMasterDto>();
            var flujoCajaMaster = new FlujoCajaMasterDto();
            var idFCLast = GetIdFcLastCreditDesem(nroDocumento?.Trim() ?? string.Empty);
            //if (idFCLast is null)
            //{
            flujoCajaMaster = ObtenerFlujoCajaItems(idFCLast is null ? 0 : idFCLast.Value, nroDocumento, nroSolicitud, "FC");
            //}
            //else
            //{
            //    flujoCajaMaster = GetFcLastCreditDesem(idFCLast.Value);
            //}
            result.Resultado = flujoCajaMaster;
            return result;
        }


        public FlujoCajaMasterDto ObtenerFlujoCajaItems(decimal idFC, string nroDocumento, decimal nroSolicitud, string vista)
        {
            try
            {
                var solicitudCreditoFiltro = new SolicitudCredito
                {
                    NumeroDocumento = nroDocumento,
                    NumeroSolicitud = nroSolicitud
                };

                var montosPlazo = new List<MontoPlazoDto>();
                var solicitudCredito = _solicitudCreditoRepository.GetByNum(solicitudCreditoFiltro, vista);
                if (solicitudCredito is not null && solicitudCredito.Plazo > 0)
                {
                    decimal numeroMeses = 0;
                    solicitudCredito.PlazoUnidad = solicitudCredito.PlazoUnidad?.Trim()?.ToUpper();
                    solicitudCredito.PlazoUnidad = solicitudCredito.PlazoUnidad != "Y" &&
                                                    solicitudCredito.PlazoUnidad != "D" ?
                                                    "M" : solicitudCredito.PlazoUnidad;

                    switch (solicitudCredito.PlazoUnidad)
                    {
                        case "D":
                            numeroMeses = Math.Ceiling(solicitudCredito.Plazo / 30.0m);
                            break;
                        case "M":
                            numeroMeses = solicitudCredito.Plazo;
                            break;
                        case "Y":
                            numeroMeses = solicitudCredito.Plazo * 12;
                            break;
                    }
                    var anio = System.DateTime.Now.Year;
                    for (int i = 0; i < numeroMeses; i++)
                    {
                        montosPlazo.Add(new MontoPlazoDto()
                        {
                            Anio = System.DateTime.Now.AddMonths(i).Year,
                            Mes = System.DateTime.Now.AddMonths(i).Month,
                            Monto = 0
                        });
                    }
                }

                var itemsFC = _itFcRepository.ObtenerItemsFC(idFC);
                var itemsDto = _mapper.Map<List<ItemFlujoCajaDto>>(itemsFC);
                var flujoCajaMaster = new FlujoCajaMasterDto();
                flujoCajaMaster.IdFC = _itFcRepository.ObtenerNewIdFC();
                flujoCajaMaster.Guf = _itFcRepository.ObtenerItemsFCGUF(idFC);
                flujoCajaMaster.Ratios = _itFcRepository.ObtenerItemsRatios(idFC);
                flujoCajaMaster.EsfaTree = ItemFlujoCajaService.BuildTree<FlujoCajaEsfaDto>(itemsDto.Where(i => i.CodItem[..3] == "ESF"));
                flujoCajaMaster.EraTree = ItemFlujoCajaService.BuildTree<FlujoCajaEraDto>(itemsDto.Where(i => i.CodItem[..3] == "ERA"));
                flujoCajaMaster.FCDetalleTree = ItemFlujoCajaService.BuildTree<FlujoCajaDetalleDto>(itemsDto.Where(i => i.CodItem[..3] == "FCD"));
                flujoCajaMaster.PeriodoFC = itemsFC[0].PeriodoActual;
                flujoCajaMaster.Producto = itemsFC[0].Producto;
                ItemFlujoCajaService.SetOtrosCargos(flujoCajaMaster, itemsDto);
                ItemFlujoCajaService.SetFlujoCajaHP(flujoCajaMaster, itemsDto);

                if (flujoCajaMaster.FCDetalleTree is not null && flujoCajaMaster.FCDetalleTree.Any())
                {
                    foreach (var item in flujoCajaMaster.FCDetalleTree)
                    {
                        EstablecerFlujoMontos(item, montosPlazo);
                    }
                }

                return flujoCajaMaster;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        private void EstablecerFlujoMontos(TreeNodeDto<FlujoCajaDetalleDto> flujoCajaDetalle, List<MontoPlazoDto> montos)
        {
            flujoCajaDetalle.Data.MontosPlazo = montos;
            if (flujoCajaDetalle.Children is not null && flujoCajaDetalle.Children.Any())
            {
                foreach (var item in flujoCajaDetalle.Children)
                {
                    EstablecerFlujoMontos(item, montos);
                }
            }
        }


        private Result<FlujoCajaMasterDto> GetFlujoCajaExistente(decimal idFC, string vista)
        {
            try
            {
                var result = new Result<FlujoCajaMasterDto>();
                var fcMaster = _fcRepository.GetFlujoCajaById(idFC, vista);

                if (fcMaster is null)
                {
                    return result.NotFound(FlujoCajaMsg.NO_ENCONTRADO);
                }
                var fcMasterDto = _mapper.Map<FlujoCajaMasterDto>(fcMaster);
                fcMasterDto.EsfaTree = BuildTree<FlujoCajaEsfa, FlujoCajaEsfaDto>(fcMaster.Esfa);
                fcMasterDto.EraTree = BuildTree<FlujoCajaEra, FlujoCajaEraDto>(fcMaster.Era);
                fcMasterDto.Ratios = _itFcRepository.ObtenerItemsRatios(idFC);
                fcMasterDto.FCDetalleTree = BuildTree<FlujoCajaDetalle, FlujoCajaDetalleDto>(fcMaster.FCDetalle);
                result.Resultado = fcMasterDto;
                return result;
            }
            catch (Exception ex)
            { throw ex; }
        }

        public FlujoCajaMasterDto GetFcLastCreditDesem(decimal idFC)
        {
            var fcMaster = _fcRepository.GetFcLastCreditDesem(idFC);
            var fcMasterDto = _mapper.Map<FlujoCajaMasterDto>(fcMaster);
            fcMasterDto.EsfaTree = BuildTree<FlujoCajaEsfa, FlujoCajaEsfaDto>(fcMaster.Esfa);
            fcMasterDto.EraTree = BuildTree<FlujoCajaEra, FlujoCajaEraDto>(fcMaster.Era);
            fcMasterDto.Ratios = _itFcRepository.ObtenerItemsRatios(idFC);
            fcMasterDto.FCDetalleTree = BuildTree<FlujoCajaDetalle, FlujoCajaDetalleDto>(fcMaster.ItemsFcd);
            return fcMasterDto;
        }

        public decimal? GetIdFcLastCreditDesem(string nroDoc)
        {
            return _fcRepository.GetIdFcLastCreditDesem(nroDoc);
        }

        private List<TreeNodeDto<T>> BuildTree<S, T>(IEnumerable<S> nodes, string codItemPadre = "") where S : IFlujoCajaItem
        {
            var parents = nodes.Where(x => x.CodItemPadre == codItemPadre);
            return parents.Select(node => new TreeNodeDto<T>
            {
                Data = _mapper.Map<T>(node),
                Children = BuildTree<S, T>(nodes, node.CodItem)
            }).ToList();
        }

        public List<FlujoCajaDto> ObtenerFlujosCaja(FilterFlujoCajaDto dto)
        {
            var flujo = _mapper.Map<FlujoCaja>(dto);
            var flujos = _fcRepository.ObtenerFlujosCaja(flujo);
            return _mapper.Map<List<FlujoCajaDto>>(flujos);
        }

        public Result<List<string>> GetYearsFromFC()
        {
            var result = new Result<List<string>>();

            var anios = _fcRepository.GetYearsFromFC();
            if (anios is null)
                return result.BadRequest($"No existen flujos de cajas registrados");

            result.Resultado = anios;

            return result;
        }
    }
}

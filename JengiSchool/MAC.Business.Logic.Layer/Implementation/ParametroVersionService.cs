using MAC.Business.Entity.Layer;
using MAC.Business.Entity.Layer.Entities;
using MAC.Business.Logic.Layer.Interfaces;
using MAC.Business.Logic.Layer.Utils;
using MAC.Data.Access.Layer.Interfaces;
using MAC.DTO;
using MAC.DTO.Constantes;
using MAC.DTO.Dtos;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace MAC.Business.Logic.Layer.Implementation
{
    public class ParametroVersionService : IParametroVersionService
    {
        private readonly IParametroVersionRepository _parametroVersionRepository;
        private readonly IMapper _mapper;

        public ParametroVersionService(IParametroVersionRepository parametroVersionRepository,
                                        IMapper mapper)
        {
            _parametroVersionRepository = parametroVersionRepository;
            _mapper = mapper;
        }

        public ParametroCodigoDto ObtenerNuevoCodigoParametroVersion()
        {
            var parametroCodigo = _parametroVersionRepository.ObtenerNuevoCodigoParametroVersion();
            return _mapper.Map<ParametroCodigoDto>(parametroCodigo);
        }

        public List<ParametroVersionDto> ObtenerParametrosVersion()
        {
            var parametrosVersion = _parametroVersionRepository.ObtenerParametrosVersion();
            return _mapper.Map<List<ParametroVersionDto>>(parametrosVersion);
        }

        public ParametroVersionDto ObtenerParametroVersionPorCodigo(string codigoVersion)
        {
            var parametroVersion = _parametroVersionRepository.ObtenerParametroVersionPorCodigo(codigoVersion);
            return _mapper.Map<ParametroVersionDto>(parametroVersion);
        }

        public bool GuardarParametroVersion(ParametroVersionDto parametroVersionDto, UserJwt userJWT)
        {
            var parametroVersion = _mapper.Map<ParametroVersion>(parametroVersionDto);
            EstablecerValoresDefaultParametroVersion(parametroVersion);
            EstablecerRegistroAuditoriaParametroVersion(parametroVersion, userJWT);
            return _parametroVersionRepository.GuardarParametroVersion(parametroVersion);
        }

        public bool ActualizarEstadoParametroVersion(string codigoVersion, string estado, UserJwt userJWT)
        {
            var parametroVersion = new ParametroVersion()
            {
                CodigoVersion = codigoVersion,
                Estado = estado,
            };
            EstablecerModificacionAuditoria(parametroVersion, userJWT);
            return _parametroVersionRepository.ActualizarEstadoParametroVersion(parametroVersion);
        }

        #region Helpers

        private void EstablecerValoresDefaultParametroVersion(ParametroVersion parametroVersion)
        {
            parametroVersion.Estado = Estado.Activo;
        }

        private void EstablecerRegistroAuditoriaParametroVersion(ParametroVersion parametroVersion, UserJwt userJWT)
        {
            EstablecerRegistroAuditoria(parametroVersion, userJWT);
            EstablecerFechaActivacion(parametroVersion, userJWT);

            parametroVersion.ParametrosGUF.ForEach(x =>
            {
                EstablecerRegistroAuditoria(x, userJWT);
            });
            parametroVersion.ParametrosDPD.ForEach(x =>
            {
                EstablecerRegistroAuditoria(x, userJWT);
            });
            parametroVersion.ParametrosDPI.ForEach(x =>
            {
                EstablecerRegistroAuditoria(x, userJWT);
            });
            parametroVersion.ParametrosRatio.ForEach(x =>
            {
                EstablecerRegistroAuditoria(x, userJWT);
            });
            parametroVersion.ParametrosTipoCliente.ForEach(x =>
            {
                EstablecerRegistroAuditoria(x, userJWT);
            });
            parametroVersion.ParametrosRSECondicion.ForEach(x =>
            {
                EstablecerRegistroAuditoria(x, userJWT);
            });
            parametroVersion.ParametrosComportamiento.ForEach(x =>
            {
                EstablecerRegistroAuditoria(x, userJWT);
            });
            parametroVersion.ParametrosAlerta.ForEach(x =>
            {
                EstablecerRegistroAuditoria(x, userJWT);
            });
            parametroVersion.ParametrosESFA.ForEach(x =>
            {
                EstablecerRegistroAuditoria(x, userJWT);
            });
        }

        private void EstablecerFechaActivacion(ParametroVersion parametroVersion, UserJwt userJWT)
        {
            parametroVersion.FechaUltimaActivacion = DateTime.Now.GetDate();
            parametroVersion.HoraUltimaActivacion = DateTime.Now.GetHour();
            parametroVersion.UsuarioUltimaActivacion = ObtenerUsuarioActual(userJWT);
            parametroVersion.FechaUltimaInactivacion = 0;
            parametroVersion.HoraUltimaInactivacion = 0;
            parametroVersion.UsuarioUltimaInactivacion = string.Empty;
        }

        private void EstablecerRegistroAuditoria(Auditoria auditoria, UserJwt userJWT)
        {
            auditoria.FechaRegistro = DateTime.Now.GetDate();
            auditoria.HoraRegistro = DateTime.Now.GetHour();
            auditoria.UsuarioRegistro = ObtenerUsuarioActual(userJWT);
            auditoria.FechaModificacion = null;
            auditoria.HoraModificacion = null;
            auditoria.UsuarioModificacion = null;
        }

        private void EstablecerModificacionAuditoria(Auditoria auditoria,UserJwt userJWT)
        {
            auditoria.FechaModificacion = DateTime.Now.GetDate();
            auditoria.HoraModificacion = DateTime.Now.GetHour();
            auditoria.UsuarioModificacion = ObtenerUsuarioActual(userJWT);
            auditoria.FechaRegistro = 0;
            auditoria.HoraRegistro = 0;
            auditoria.UsuarioRegistro = string.Empty;
        }

        private string ObtenerUsuarioActual(UserJwt userJWT)
        {
            return userJWT.CodUsuario;
        }

        #endregion

        public ParametroVersionDto ObtenerParametroVersionActivo(int id)
        {
            var parametroVersion = _parametroVersionRepository.ObtenerParametroVersionActivo(id);
            return _mapper.Map<ParametroVersionDto>(parametroVersion);
        }
    }
}

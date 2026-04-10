using MAC.Business.Entity.Layer;
using MAC.Business.Entity.Layer.Entities;
using MAC.Business.Logic.Layer.Interfaces;
using MAC.Data.Access.Layer.Interfaces;
using MAC.DTO.Dtos;
using AutoMapper;
using System.Collections.Generic;

namespace MAC.Business.Logic.Layer.Implementation
{
    public class SolicitudCreditoService : ISolicitudCreditoService
    {
        private readonly ISolicitudCreditoRepository _solicitudCreditoRepository;
        private readonly IMapper _mapper;

        public SolicitudCreditoService(ISolicitudCreditoRepository solicitudCreditoRepository,
                                        IMapper mapper)
        {
            _solicitudCreditoRepository = solicitudCreditoRepository;
            _mapper = mapper;
        }

        public List<SolicitudCreditoDto> ObtenerSolicitudesCredito(FilterSolicitudCreditoDto dto, UserJwt userJWT)
        {
            var solicitud = _mapper.Map<SolicitudCredito>(dto);
            solicitud.CodUsuario = userJWT.CodUsuario;
            var solicitudesCredito = _solicitudCreditoRepository.ObtenerSolicitudesCredito(solicitud);
            return _mapper.Map<List<SolicitudCreditoDto>>(solicitudesCredito);
        }

        public SolicitudCreditoDto GetByNum(FilterSolicitudCreditoDto dto,string vista)
        {
            var solicitud = _mapper.Map<SolicitudCredito>(dto);
            var solicitudesCredito = _solicitudCreditoRepository.GetByNum(solicitud, vista);
            return _mapper.Map<SolicitudCreditoDto>(solicitudesCredito);
        }

    }
}

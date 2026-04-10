using MAC.Business.Entity.Layer.Entities;
using MAC.DTO.Dtos;
using AutoMapper;

namespace MAC.Business.Logic.Layer.Profiles
{
    public class SolicitudCreditoProfile : Profile
    {
        public SolicitudCreditoProfile()
        {
            CreateMap<SolicitudCredito, SolicitudCreditoDto>().ReverseMap();
            CreateMap<FilterSolicitudCreditoDto, SolicitudCredito>();
            
        }
    }
}

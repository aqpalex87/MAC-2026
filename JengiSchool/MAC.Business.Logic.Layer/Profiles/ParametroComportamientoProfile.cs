using MAC.Business.Entity.Layer.Entities;
using MAC.DTO.Dtos;
using AutoMapper;

namespace MAC.Business.Logic.Layer.Profiles
{
    public class ParametroComportamientoProfile : Profile
    {
        public ParametroComportamientoProfile()
        {
            CreateMap<ParametroComportamientoDto, ParametroComportamiento>()
                .ForMember(dest => dest.FechaRegistro, opt => opt.Ignore())
                .ForMember(dest => dest.FechaModificacion, opt => opt.Ignore())
                .ForMember(dest => dest.HoraRegistro, opt => opt.Ignore())
                .ForMember(dest => dest.HoraModificacion, opt => opt.Ignore());

            CreateMap<ParametroComportamiento, ParametroComportamientoDto>();
        }
    }
}

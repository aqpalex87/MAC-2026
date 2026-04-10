using MAC.Business.Entity.Layer.Entities;
using MAC.DTO.Dtos;
using AutoMapper;

namespace MAC.Business.Logic.Layer.Profiles
{
    public class ParametroTipoClienteProfile : Profile
    {
        public ParametroTipoClienteProfile()
        {
            CreateMap<ParametroTipoClienteDto, ParametroTipoCliente>()
                .ForMember(dest => dest.FechaRegistro, opt => opt.Ignore())
                .ForMember(dest => dest.FechaModificacion, opt => opt.Ignore())
                .ForMember(dest => dest.HoraRegistro, opt => opt.Ignore())
                .ForMember(dest => dest.HoraModificacion, opt => opt.Ignore());

            CreateMap<ParametroTipoCliente, ParametroTipoClienteDto>();
        }
    }
}

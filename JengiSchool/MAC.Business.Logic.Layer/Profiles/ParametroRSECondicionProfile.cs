using MAC.Business.Entity.Layer.Entities;
using MAC.DTO.Dtos;
using AutoMapper;

namespace MAC.Business.Logic.Layer.Profiles
{
    public class ParametroRSECondicionProfile : Profile
    {
        public ParametroRSECondicionProfile()
        {
            CreateMap<ParametroRSECondicionDto, ParametroRSECondicion>()
                .ForMember(dest => dest.FechaRegistro, opt => opt.Ignore())
                .ForMember(dest => dest.FechaModificacion, opt => opt.Ignore())
                .ForMember(dest => dest.HoraRegistro, opt => opt.Ignore())
                .ForMember(dest => dest.HoraModificacion, opt => opt.Ignore());

            CreateMap<ParametroRSECondicion, ParametroRSECondicionDto>();

        }
    }
}

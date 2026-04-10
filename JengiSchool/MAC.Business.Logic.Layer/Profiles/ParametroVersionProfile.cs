using MAC.Business.Entity.Layer.Entities;
using MAC.Business.Logic.Layer.Utils;
using MAC.DTO.Dtos;
using AutoMapper;

namespace MAC.Business.Logic.Layer.Profiles
{
    public class ParametroVersionProfile : Profile
    {
        public ParametroVersionProfile()
        {
            CreateMap<ParametroVersionDto, ParametroVersion>()
                .ForMember(dest => dest.FechaUltimaInactivacion, opt => opt.Ignore())
                .ForMember(dest => dest.FechaUltimaActivacion, opt => opt.Ignore())
                .ForMember(dest => dest.FechaRegistro, opt => opt.Ignore())
                .ForMember(dest => dest.FechaModificacion, opt => opt.Ignore())
                .ForMember(dest => dest.HoraRegistro, opt => opt.Ignore())
                .ForMember(dest => dest.HoraModificacion, opt => opt.Ignore());

            CreateMap<ParametroVersion, ParametroVersionDto>()
                .ForMember(dest => dest.FechaUltimaActivacion, opt => opt.MapFrom(src => src.FechaUltimaActivacion.GetFecha()))
                .ForMember(dest => dest.FechaUltimaInactivacion, opt => opt.MapFrom(src => src.FechaUltimaInactivacion.GetFecha()))
                .ForMember(dest => dest.FechaRegistro, opt => opt.MapFrom(src => src.FechaRegistro.GetFecha()));
        }
    }
}

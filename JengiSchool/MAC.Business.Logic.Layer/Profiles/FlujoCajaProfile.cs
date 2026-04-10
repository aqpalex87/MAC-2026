using MAC.Business.Entity.Layer.Entities;
using MAC.DTO.Dtos;
using AutoMapper;

namespace MAC.Business.Logic.Layer.Profiles
{
    public class FlujoCajaProfile : Profile
    {
        public FlujoCajaProfile()
        {
            CreateMap<FlujoCajaMasterDto, FlujoCajaMaster>().ReverseMap();
            CreateMap<FlujoCajaMasterRequestDto, FlujoCajaMaster>().ReverseMap();
            CreateMap<FlujoCajaGufDto, FlujoCajaGuf>().ReverseMap();
            CreateMap<FlujoCajaEsfaDto, FlujoCajaEsfa>().ReverseMap();
            CreateMap<FlujoCajaEraDto, FlujoCajaEra>().ReverseMap();
            CreateMap<FlujoCajaDetalleDto, FlujoCajaDetalle>().ReverseMap();
            CreateMap<MontoPlazo, MontoPlazoDto>().ReverseMap();
            CreateMap<FlujoCajaDpdDto, FlujoCajaDpd>().ReverseMap();
            CreateMap<FlujoCajaDpiDto, FlujoCajaDpi>().ReverseMap();
            CreateMap<FlujoCajaPdrDto, FlujoCajaPdr>().ReverseMap();
            CreateMap<FlujoCajaOcDto, FlujoCajaOc>().ReverseMap();
            CreateMap<FlujoCajaHPDto, FlujoCajaHP>().ReverseMap();
            CreateMap<FlujoCajaRatioDto, FlujoCajaRatio>().ReverseMap();
            CreateMap<FlujoCajaRseDto, FlujoCajaRse>().ReverseMap();
            CreateMap<FlujoCajaHtDto, FlujoCajaHt>().ReverseMap();
            CreateMap<ItemFlujoCaja, ItemFlujoCajaDto>().ReverseMap();
            CreateMap<FlujoCajaAnterior, FlujoCajaAnteriorDto>();
            CreateMap<FlujoCaja, FlujoCajaDto>().ReverseMap();
            CreateMap<FlujoCaja, FilterFlujoCajaDto>().ReverseMap();
            CreateMap<FlujoCajaAnterior, FlujoCajaMasterDto>().ReverseMap();


            
        }
    }
}

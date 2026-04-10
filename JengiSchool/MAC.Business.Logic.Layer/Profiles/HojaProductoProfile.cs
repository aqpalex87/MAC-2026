using MAC.Business.Entity.Layer.Entities;
using MAC.DTO.Dtos;
using AutoMapper;

namespace MAC.Business.Logic.Layer.Profiles
{
    public class HojaProductoProfile : Profile
    {
        public HojaProductoProfile()
        {
            CreateMap<HojaProducto, HojaProductoDto>();
        }
    }
}

using AutoMapper;
using MAC.Business.Entity.Layer.Entities;
using MAC.DTO.Dtos;

namespace MAC.Business.Logic.Layer.Profiles
{
    public class SedesProfile : Profile
    {
        public SedesProfile()
        {
            CreateMap<Sedes, SedesDto>();
            CreateMap<SedesDto, Sedes>();
        }
    }
}

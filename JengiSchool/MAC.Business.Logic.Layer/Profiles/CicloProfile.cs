using AutoMapper;
using MAC.Business.Entity.Layer.Entities;
using MAC.DTO.Dtos;

namespace MAC.Business.Logic.Layer.Profiles
{
    public class CicloProfile : Profile
    {
        public CicloProfile()
        {
            CreateMap<Ciclo, CicloDto>();
            CreateMap<CicloDto, Ciclo>();
        }
    }
}

using MAC.Business.Entity.Layer;
using MAC.DTO;
using AutoMapper;

namespace MAC.Business.Logic.Layer.Profiles
{
    public class ClienteProfile : Profile
    {
        public ClienteProfile()
        {
            CreateMap<ClienteDto, Cliente>().ReverseMap();
        }
    }
}

using MAC.Business.Entity.Layer;
using MAC.Business.Entity.Layer.Entities;
using MAC.Business.Logic.Layer.Utils;
using MAC.DTO;
using MAC.DTO.Dtos;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAC.Business.Logic.Layer.Profiles
{
    public class ParametroParametroCodigo : Profile
    {
        public ParametroParametroCodigo()
        {
            CreateMap<ParametroCodigoDto, ParametroCodigo>().ReverseMap();
        }
    }
}

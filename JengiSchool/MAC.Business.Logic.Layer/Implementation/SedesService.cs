using AutoMapper;
using MAC.Business.Logic.Layer.Interfaces;
using MAC.Data.Access.Layer.Interfaces;
using MAC.DTO.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAC.Business.Logic.Layer.Implementation
{
    public class SedesService : ISedesService
    {
        private readonly ISedesRepository _sedesRepository;
        private readonly IMapper _mapper;

        public SedesService(ISedesRepository sedesRepository,IMapper mapper)
        {
            _sedesRepository = sedesRepository;
            _mapper = mapper;
        }
        public List<SedesDto> ObtenerSedes(int CodCliente)
        {
            var sedes = _sedesRepository.ObtenerSedes(CodCliente);
            return _mapper.Map<List<SedesDto>>(sedes);
        }
    }
}

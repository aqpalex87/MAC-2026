using MAC.Business.Entity.Layer.Utils;
using MAC.Business.Logic.Layer.Interfaces;
using MAC.Data.Access.Layer.Interfaces;
using MAC.DTO.Dtos;
using AutoMapper;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace MAC.Business.Logic.Layer.Implementation
{
    public class HojaProductoService : IHojaProductoService
    {
        private readonly IHojaProductoRepository _hojaProductoRepository;
        private readonly IMapper _mapper;
        private readonly ILaserficheRepository _laserficheRepository;

        public HojaProductoService(IHojaProductoRepository hojaProductoRepository, IMapper mapper, ILaserficheRepository laserficheRepository)
        {
            _hojaProductoRepository = hojaProductoRepository;
            _mapper = mapper;
            _laserficheRepository = laserficheRepository;
        }

        public List<HojaProductoDto> GetAllByUbigeoDep(string ubigeoDep)
        {
            var hojasProducto = _hojaProductoRepository.GetAllByUbigeoDep(ubigeoDep);
            return _mapper.Map<List<HojaProductoDto>>(hojasProducto);
        }

        public LaserficheResponse DownloadFile(int codigoLaserfiche)
        {
            var strJsonBodyLaserfiche = JsonConvert.SerializeObject( new { codigoLaserfiche });
            var strJsonLaserfiche = _laserficheRepository.ConsultarServicio(Endpoints.GET_FILE_BYTES, strJsonBodyLaserfiche);
            var laserficheResponse = JsonConvert.DeserializeObject<LaserficheResponse>(strJsonLaserfiche);

            return laserficheResponse;
        }


    }
}

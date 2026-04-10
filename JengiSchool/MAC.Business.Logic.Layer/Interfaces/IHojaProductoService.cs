using MAC.Business.Entity.Layer.Utils;
using MAC.DTO.Dtos;
using System.Collections.Generic;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface IHojaProductoService
    {
        public List<HojaProductoDto> GetAllByUbigeoDep(string ubigeoDep);
        public LaserficheResponse DownloadFile(int codigoLaserfiche);
    }
}

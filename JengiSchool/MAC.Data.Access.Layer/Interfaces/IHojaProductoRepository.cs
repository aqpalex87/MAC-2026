using MAC.Business.Entity.Layer.Entities;
using System.Collections.Generic;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface IHojaProductoRepository
    {
        List<HojaProducto> GetAllByUbigeoDep(string ubigeoDep);

    }
}

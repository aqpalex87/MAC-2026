using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAC.DTO.Dtos
{
    public class FlujoCajaHPDto {
        public string CodItem { get; set; }
        public string Descripcion { get; set; }
        private decimal? _monto;
        public decimal? Monto
        {
            get { return _monto; }
            set
            {
                if (value == 0) _monto = null;
                else _monto = value;
            }
        }
    }

}

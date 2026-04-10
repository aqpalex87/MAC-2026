using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAC.Business.Entity.Layer.Utils
{
    public  class LaserficheResponse
    {
        public int Resultado { get; set; }
        public string Mensaje { get; set; }
        public dynamic Data { get; set; }        
    }
}

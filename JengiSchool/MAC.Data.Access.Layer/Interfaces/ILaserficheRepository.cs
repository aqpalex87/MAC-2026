using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface ILaserficheRepository
    {
        string ConsultarServicio(string endpoint, string strJsonBody);
    }
}

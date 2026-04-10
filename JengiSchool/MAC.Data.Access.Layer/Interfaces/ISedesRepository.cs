using MAC.Business.Entity.Layer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAC.Data.Access.Layer.Interfaces
{
    public interface ISedesRepository
    {
        public List<Sedes> ObtenerSedes(int CodCliente);
    }
}

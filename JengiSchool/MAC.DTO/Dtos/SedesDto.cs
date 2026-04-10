using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAC.DTO.Dtos
{
    public class SedesDto
    {
        public int IdSede { get; set; }
        public int IdCliente { get; set; }

        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string IdEncargado1 { get; set; }
        public string IdEncargado2 { get; set; }

    }
}

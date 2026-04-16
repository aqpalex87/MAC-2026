using System.Collections.Generic;

namespace MAC.DTO.Dtos
{
    public class CicloPaginadoDto
    {
        public int TotalRows { get; set; }
        public List<CicloDto> Items { get; set; } = new();
    }
}

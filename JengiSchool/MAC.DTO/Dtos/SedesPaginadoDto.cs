using System.Collections.Generic;

namespace MAC.DTO.Dtos
{
    public class SedesPaginadoDto
    {
        public int TotalRows { get; set; }
        public List<SedesDto> Items { get; set; } = new();
    }
}

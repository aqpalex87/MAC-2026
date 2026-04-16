using System.Collections.Generic;

namespace MAC.DTO.Dtos
{
    public class CarnetListadoPaginadoDto
    {
        public int TotalRows { get; set; }
        public List<CarnetListadoDto> Items { get; set; } = new();
    }
}

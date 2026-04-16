using System.Collections.Generic;

namespace MAC.DTO.Dtos
{
    public class AlumnoPaginadoDto
    {
        public int TotalRows { get; set; }
        public List<AlumnoDto> Items { get; set; } = new();
    }
}

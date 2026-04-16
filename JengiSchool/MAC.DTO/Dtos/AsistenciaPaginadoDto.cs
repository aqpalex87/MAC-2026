using System.Collections.Generic;

namespace MAC.DTO.Dtos
{
    public class AsistenciaPaginadoDto
    {
        public int TotalRows { get; set; }
        public List<AsistenciaListadoDto> Items { get; set; } = new();
    }
}

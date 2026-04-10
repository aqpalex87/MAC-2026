using System.Collections.Generic;

namespace MAC.DTO.Dtos
{
    public class WrappedItemsFcDto
    {
        public List<TreeNodeDto<FlujoCajaEsfaDto>> EsfaTree { get; set; }
        public List<TreeNodeDto<FlujoCajaEraDto>> EraTree { get; set; }
        public List<TreeNodeDto<FlujoCajaDetalleDto>> FcDetalleTree { get; set; }
    }
}

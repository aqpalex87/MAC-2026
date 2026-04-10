using System.Collections.Generic;

namespace MAC.DTO.Dtos
{
    public class TreeNodeDto<T>
    {
        public T Data { get; set; }
        public List<TreeNodeDto<T>> Children { get; set; }
    }
}

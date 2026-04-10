using MAC.DTO;
using System.Collections.Generic;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface IClienteService
    {
        List<ClienteDto> GetClientesByFiltro(ClienteDto clienteDto);
    }
}

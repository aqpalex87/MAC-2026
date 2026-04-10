using MAC.Business.Entity.Layer;
using MAC.Business.Logic.Layer.Interfaces;
using MAC.Data.Access.Layer.Interfaces;
using MAC.DTO;
using AutoMapper;
using System.Collections.Generic;

namespace MAC.Business.Logic.Layer.Implementation
{
    public class ClienteService : IClienteService
    {
        private readonly IClienteRepository _clienteRepository;
        private readonly IMapper _mapper;

        public ClienteService(IClienteRepository ClienteRepository, IMapper mapper)
        {
            _clienteRepository = ClienteRepository;
            _mapper = mapper;
        }

        public List<ClienteDto> GetClientesByFiltro(ClienteDto clienteDto)
        {
            List<Cliente> clientes = null;
            if (!string.IsNullOrWhiteSpace(clienteDto.Nombre))
            {
                clientes = _clienteRepository.GetClienteByNombre($"%{clienteDto.Nombre.ToUpper()}%");
            }
            else if (!string.IsNullOrWhiteSpace(clienteDto.NumDoc))
            {
                clientes = _clienteRepository.GetClienteByNroDoc(clienteDto.NumDoc);
            }
            else if (clienteDto.CodCliente.HasValue)
            {
                clientes = _clienteRepository.GetClienteByCodigo(clienteDto.CodCliente);
            }
            return _mapper.Map<List<ClienteDto>>(clientes);
        }
    }
}

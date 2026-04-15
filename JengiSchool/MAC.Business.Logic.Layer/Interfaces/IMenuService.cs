using MAC.DTO;
using MAC.DTO.Dtos;
using System.Collections.Generic;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface IMenuService
    {
        Result<MenuPaginadoDto> ObtenerMenusPaginado(string nombre, int pageNumber, int pageSize);
        Result<List<MenuCrudDto>> ObtenerMenusPadre();
        Result<MenuCrudDto> CrearMenu(MenuCrudDto request, int? idRol);
        Result<MenuCrudDto> ActualizarMenu(int idMenu, MenuCrudDto request);
        Result<bool> EliminarMenu(int idMenu);
    }
}

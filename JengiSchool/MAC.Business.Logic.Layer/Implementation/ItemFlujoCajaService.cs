using MAC.Business.Entity.Layer.Entities;
using MAC.Business.Entity.Layer.Utils;
using MAC.Business.Logic.Layer.Interfaces;
using MAC.Data.Access.Layer.Interfaces;
using MAC.DTO.Dtos;
using MAC.DTO.Interfaces;
using AutoMapper;
using System.Collections.Generic;
using System.Linq;

namespace MAC.Business.Logic.Layer.Implementation
{
    public class ItemFlujoCajaService : IItemFlujoCajaService
    {
        private readonly IItemFlujoCajaRepository _itFcRepository;
        private readonly IFlujoCajaService _fcService;
        private readonly IMapper _mapper;

        public ItemFlujoCajaService(IItemFlujoCajaRepository itemFCRepository,
                                    IFlujoCajaService flujoCajaService,
                                        IMapper mapper)
        {
            _itFcRepository = itemFCRepository;
            _fcService = flujoCajaService;
            _mapper = mapper;
        }

        //public object ObtenerItemsFC(string nroDoc)
        //{
        //    var idFC = _fcService.GetIdFcLastCreditDesem(nroDoc);
        //    if (idFC is null)
        //    {
        //        return ObtenerItemsFC();
        //    }
        //    else
        //    {
        //        var fc = _fcService.GetFcLastCreditDesem(idFC.Value);
        //        return fc;
        //    }
        //}

        //public WrappedItemsFcDto ObtenerItemsFC()
        //{
        //    var itemsFC = _itFcRepository.ObtenerItemsFC();
        //    var itemsDto = _mapper.Map<List<ItemFlujoCajaDto>>(itemsFC);
        //    WrappedItemsFcDto wrappedItems = new()
        //    {
        //        EsfaTree = BuildTree<FlujoCajaEsfaDto>(itemsDto.Where(i => i.CodItem[..3] == "ESF")),
        //        EraTree = BuildTree<FlujoCajaEraDto>(itemsDto.Where(i => i.CodItem[..3] == "ERA")),
        //        FcDetalleTree = BuildTree<FlujoCajaDetalleDto>(itemsDto.Where(i => i.CodItem[..3] == "FCD"))
        //    };

        //    return wrappedItems;
        //}



        public static List<TreeNodeDto<T>> BuildTree<T>(IEnumerable<ItemFlujoCajaDto> menu, string codItemPadre = "") where T : IFlujoCajaItemDto, new()
        {
            var parents = menu.Where(x => x.CodItemPadre == codItemPadre);
            return parents.Select(x => new TreeNodeDto<T>
            {
                Data = new T { CodItem = x.CodItem, Descripcion = x.Descripcion, CodItemPadre = x.CodItemPadre , MontoAnterior = x.MontoAnterior },
                Children = BuildTree<T>(menu, x.CodItem)
            }).ToList();
        }

        public static void SetOtrosCargos(FlujoCajaMasterDto fc, IEnumerable<ItemFlujoCajaDto> items)
        {
            fc.OtrosCargos = items.Where(m => m.CodItem[0..3] == GrupoItem.OTROS_CARGOS)
                            .Select(m => new FlujoCajaOcDto
                            {
                                CodItem = m.CodItem,
                                Descripcion = m.Descripcion,
                                Tasa = (decimal)m.Tasa,
                            }).ToList();
        }

        public static void SetFlujoCajaHP(FlujoCajaMasterDto fc, IEnumerable<ItemFlujoCajaDto> montos)
        {
            fc.FlujoCajaHP = montos.Where(m => m.CodItem[0..2] == GrupoItem.HOJA_PRODUCTO)
                            .Select(m => new FlujoCajaHPDto
                            {
                                CodItem = m.CodItem,
                                Descripcion = m.Descripcion,
                            }).ToList();
        }


    }
}

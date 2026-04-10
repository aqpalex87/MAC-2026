using MAC.Business.Entity.Layer;
using MAC.Business.Entity.Layer.Entities;
using MAC.DTO;
using MAC.DTO.Dtos;
using System.Collections.Generic;

namespace MAC.Business.Logic.Layer.Interfaces
{
    public interface IFlujoCajaService
    {
        Result<bool> EditarFlujoCaja(FlujoCajaMasterRequestDto fcDto, UserJwt userJWT);
        Result<FlujoCajaMasterDto> GuardarFlujoCaja(FlujoCajaMasterRequestDto fcDto, UserJwt userJWT);
        Result<FlujoCajaMasterDto> GetFlujoCajaById(decimal idFC, string nroDocumento, decimal nroSolicitud,string vista);
        Result<bool> FinalizarFlujoCaja(int idFc, UserJwt userJWT);
        Result<bool> SaveCommentRevision(int idFc, string comment, UserJwt userJWT);
        decimal? GetIdFcLastCreditDesem(string nroDoc);
        FlujoCajaMasterDto GetFcLastCreditDesem(decimal idFC);
        List<FlujoCajaDto> ObtenerFlujosCaja(FilterFlujoCajaDto filtro);

        Result<List<string>> GetYearsFromFC();
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAC.DTO.Dtos
{
    public  class LoginDTO
    {         
        public string codigo { get; set; }
        public string mensaje { get; set; }
        public string estado { get; set; }
        public object response { get; set; }

    }

    public class LoginNewDTO<T>
    {
        public string codigo { get; set; }
        public string mensaje { get; set; }
        public string estado { get; set; }
        public T response { get; set; }

    }

    public class ValidateToken
    {
        public string credito { get; set; }
        public string numeroDocumento { get; set; }
        public string usuario { get; set; }
        public string opcion { get; set; }
        public decimal idFC { get; set; }
    }

    public class LoginTokenRequest
    {
        public string token { get; set; }
        public string estado {  get; set; }
        public string URLApiAutenticate { get; set; }
        public string URLApiObtenerUsuario { get; set; }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string IpCliente { get; set; }
        public string UrlAcceso { get; set; }
        public string UrlPathName { get; set; }
        public string IdAplicacion { get; set; }
        public string Opcion { get; set; }
        public string token { get; set; }
        public string URLApiAutenticate { get; set; }
        public string URLApiObtenerUsuario { get; set; }
        public string SolCredito { get; set; }
        public string NumDocumento { get; set; }

    }
    public class UserToken
    {
        public string vToken { get; set; }
        public string vId { get; set; }
        public string vNombre { get; set; }
        public string vCargo { get; set; }
        public string vEmail { get; set; }
        public string vUsuarioWeb { get; set; }
        public string vOpcion { get; set; }
        public string vUsuarioAD { get; set; }
        public object vEstadoAD { get; set; }
        public string vAgenciaAsignada { get; set; }
        public string vDescripcionAgencia { get; set; }
        public string vPassword { get; set; }
        public List<Agencia> Agencias { get; set; }
        public string vCodFuncionario { get; set; }
        public string vPerfilDescripcion { get; set; }
        public ServicioResponse eServicioResponse { get; set; }
        public string vSolCredito { get; set; }
        public string vNumDocumento { get; set; }
        public decimal vIdFC { get; set; }
    }

    public class Agencia
    {
        public string vCodigo { get; set; }
        public object Valor { get; set; }
        public object Descripcion { get; set; }
        public object NombreRegional { get; set; }
    }

    public class ServicioResponse
    {
        public int Resultado { get; set; }
        public object Mensaje { get; set; }
    }

}

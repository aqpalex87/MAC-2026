 

namespace MAC.Business.Entity.Layer.Entities
{
    public class LoginExterno
    {
        public string Credito { get; set; }
        public string NumeroDocumento { get; set; }
        public string Usuario { get; set; }
        public string Opcion { get; set; }
        public decimal IdFC { get; set; }
    }
    public class LoginResponse
    {
        public string CodResupuesta { get; set; }
        public string Mensaje { get; set; }
        
    }
}

using System.Collections.Generic;
using System.Net.Mail;

namespace MAC.Business.Logic.Layer.Utils
{
    public class CorreoMensaje
    {
        public List<string> Para { get; set; } = new();
        public List<string> Copia { get; set; } = new();
        public string Cuerpo { get; set; }
        public string Asunto { get; set; }
        public List<Attachment> Adjuntos { get; set; } = new();
    }
}

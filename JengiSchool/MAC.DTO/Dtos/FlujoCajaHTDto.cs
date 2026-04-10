using System.Globalization;
using System;

namespace MAC.DTO.Dtos
{
    /// <summary>
    /// Representa la Hoja de Trabajo del Flujo de Caja.
    /// </summary>
    public class FlujoCajaHtDto
    {
        public string Comentario { get; set; }
        public int IdLaserfiche { get; set; }

        /*******************/
        public int CodigoLaserfiche { get; set; }
        public string ArchivoBytes{ get; set; }
        public string Extension{ get; set; }
        public string Nombre { get; set; }

        /*************************/
        public string Estado { get; set; }

        private string fechaRegistro;
        public string FechaRegistro {
            get { return fechaRegistro; }
            set {
                if (string.IsNullOrEmpty(value))
                    fechaRegistro =  string.Empty;

                DateTime.TryParseExact(value.Trim().ToString(), "yyyyMMdd", null, DateTimeStyles.None, out DateTime date);
                fechaRegistro = date.ToString("dd/MM/yyyy");
            } 
        }
        public string HoraRegistro { get; set; }
        public string UsuarioRegistro { get; set; }
    }
}

using iTextSharp.text;
using iTextSharp.text.pdf;

namespace MAC.API.Utils
{
    public class PdfCellFactory
    {
        public Font Font { get; set; }
        public int Border { get; set; }
        public BaseColor BaseColor { get; set; }
        public PdfCellFactory(Font font, int border = 0)
        {
            Font = font;
            Border = border;

        }

        /// <summary>
        /// Obtiene una instancia de PdfPCell con la alineación vertical centrada.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public PdfPCell Get(string value)
        {
            var cell = new PdfPCell(new Phrase(value, Font)) { Border = Border }.VAlign();
            cell.BackgroundColor = BaseColor;
            return cell;
        }

        /// <summary>
        /// Obtiene una instancia de PdfPCell con la alineación vertical centrada.
        /// </summary>
        /// <param name="value">Valor de la Celda</param>
        /// <param name="font">Fuente del Texto</param>
        /// <returns></returns>
        public PdfPCell Get(string value, Font font)
        {
            var cell = new PdfPCell(new Phrase(value, font)) { Border = Border }.VAlign();
            cell.BackgroundColor = BaseColor;
            return cell;
        }
    }
}

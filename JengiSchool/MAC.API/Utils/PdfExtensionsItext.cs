using iText.Layout;
using iText.Layout.Element;

namespace MAC.API.Utils
{
    public static class PdfExtensionsItext
    {
        public static Cell AddCell(this Table table, string content, Style style)
        {
            var cell = new Cell().Add(new Paragraph(content ?? string.Empty)).AddStyle(style);
            table.AddCell(cell);
            return cell;
        }

        public static Cell AddCell(this Table table, string content, Style style, int colSpan)
        {
            var cell = new Cell(1, colSpan).Add(new Paragraph(content)).AddStyle(style);
            table.AddCell(cell);
            return cell;
        }

        public static Cell AddHeaderCell(this Table table, string content, Style style)
        {
            var cell = new Cell().Add(new Paragraph(content ?? string.Empty)).AddStyle(style);
            table.AddHeaderCell(cell);
            return cell;
        }
    }
}

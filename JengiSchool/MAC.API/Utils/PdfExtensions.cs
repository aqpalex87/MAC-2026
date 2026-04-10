using iTextSharp.text;
using iTextSharp.text.pdf;

namespace MAC.API.Utils
{
    public static class PdfExtensions
    {
        public static PdfPCell VAlign(this PdfPCell cell)
        {
            cell.UseAscender = true;
            cell.VerticalAlignment = Element.ALIGN_MIDDLE;
            return cell;
        }

        public static PdfPCell HAlign(this PdfPCell cell)
        {
            cell.UseAscender = true;
            cell.VerticalAlignment = Element.ALIGN_MIDDLE;
            cell.HorizontalAlignment = Element.ALIGN_CENTER;
            return cell;
        }

        public static PdfPCell RigthAlign(this PdfPCell cell)
        {
            cell.HorizontalAlignment = Element.ALIGN_RIGHT;
            return cell;
        }

        public static PdfPCell NoPadding(this PdfPCell cell)
        {
            cell.Padding = 0;
            return cell;
        }

        public static PdfPCell Colspan(this PdfPCell cell, int columspan)
        {
            cell.Colspan = columspan;
            return cell;
        }

        public static PdfPCell PaddingTopBottom(this PdfPCell cell, float padding)
        {
            cell.PaddingTop = padding;
            cell.PaddingBottom = padding;
            return cell;
        }

        public static Rectangle BorderTop(this Rectangle cell, float border)
        {
            cell.BorderWidthTop = border;
            return cell;
        }
    }
}
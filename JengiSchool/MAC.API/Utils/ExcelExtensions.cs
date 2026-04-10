using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace MAC.API.Utils
{
    public static class ExcelExtensions
    {
        public static ExcelRangeBase SetValue(this ExcelRangeBase excelRange, object value)
        {
            excelRange.Value = value;
            return excelRange;
        }

        public static ExcelRangeBase Bold(this ExcelRangeBase excelRange)
        {
            excelRange.Style.Font.Bold = true;
            return excelRange;
        }

        public static ExcelRangeBase Merge(this ExcelRangeBase excelRange)
        {
            excelRange.Merge = true;
            return excelRange;
        }

        public static ExcelRangeBase AlignCenter(this ExcelRangeBase excelRange)
        {
            excelRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            return excelRange;
        }
        public static ExcelRangeBase AlignLeft(this ExcelRangeBase excelRange)
        {
            excelRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
            return excelRange;
        }
        public static ExcelRangeBase AlignRight(this ExcelRangeBase excelRange)
        {
            excelRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
            return excelRange;
        }

        public static ExcelRangeBase FontSize(this ExcelRangeBase excelRange, float size)
        {
            excelRange.Style.Font.Size = size;
            return excelRange;
        }

        public static ExcelRangeBase SetUnderline(this ExcelRangeBase excelRange)
        {
            excelRange.Style.Font.UnderLine = true;
            return excelRange;
        }
    }
}

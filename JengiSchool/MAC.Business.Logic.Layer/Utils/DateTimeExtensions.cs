using System;

namespace MAC.Business.Logic.Layer.Utils
{
    public static class DateTimeExtensions
    {
        public static decimal GetDate(this DateTime dateTime)
        {
            return decimal.Parse(dateTime.ToString("yyyyMMdd"));
        }

        public static decimal GetHour(this DateTime dateTime)
        {
            return decimal.Parse(dateTime.ToString("HHmmss"));
        }
    }
}

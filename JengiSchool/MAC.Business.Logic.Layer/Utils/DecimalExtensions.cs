using System;
using System.Globalization;

namespace MAC.Business.Logic.Layer.Utils
{
    internal static class DecimalExtensions
    {
        internal static string GetFecha(this decimal fechaNumerico)
        {
            if (fechaNumerico <= 0)
                return string.Empty;

            DateTime.TryParseExact(fechaNumerico.ToString(), "yyyyMMdd", null, DateTimeStyles.None, out DateTime date);
            return date.ToString("dd/MM/yyyy");
        }
        internal static string GetFecha(this decimal? fechaNumerico)
        {
            if (fechaNumerico == null || fechaNumerico <= 0)
                return string.Empty;

            DateTime.TryParseExact(fechaNumerico.ToString(), "yyyyMMdd", null, DateTimeStyles.None, out DateTime fecha);
            return fecha.ToString("dd/MM/yyyy");
        }

        internal static string GetHora(this decimal horaNumerico)
        {
            if (horaNumerico <= 0)
                return string.Empty;

            var hora = DateTime.ParseExact(string.Format("{0:D6}", horaNumerico), "HHmmss", CultureInfo.InvariantCulture);
            return hora.ToString("HH:mm:ss");
        }

        internal static string GetHora(this decimal? horaNumerico)
        {
            if (horaNumerico == null || horaNumerico <= 0)
                return string.Empty;

            var hora = DateTime.ParseExact(string.Format("{0:D6}", horaNumerico), "HHmmss", CultureInfo.InvariantCulture);
            return hora.ToString("HH:mm:ss");
        }

    }


}

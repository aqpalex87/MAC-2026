
using Microsoft.Extensions.Configuration;
using Microsoft.Win32;
using System;
using System.ComponentModel.Composition;
using System.ComponentModel.Composition.Hosting;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace MAC.Business.Logic.Layer.Utils
{
    public class Notification
    {
        private readonly int CorreoEnableEncript;
        private const int ENABLE_ENCRIPT_HAB = 1;
        private const int ENABLE_ENCRIPT_DES = 0;
        private readonly string CorreoApplicationName;
        private readonly string ClaveEncriptado;

        public Notification(IConfiguration configuration)
        {
            CorreoEnableEncript = configuration.GetValue<int>("CorreoApplicationNameEnableEncrip");
            CorreoApplicationName = configuration.GetValue<string>("CorreoApplicationName");
            ClaveEncriptado = configuration.GetValue<string>("RegeditPass");
        }

        private void CorreoAcces(out string _from, out string _userName, out string _password, out string _hostName, out int _port)
        {
            _from = "";
            _userName = "";
            _password = "";
            _hostName = "";
            _port = 0;
         
               
           
        }

        public void EnviarCorreo(CorreoMensaje correoMensaje)
        {
            Task.Run(async () =>
            {
                CorreoAcces(out string _from, out string _userName, out string _password, out string _hostName, out int _port);

                using MailMessage message = new();
                message.From = new MailAddress(_from);

                var body = correoMensaje.Cuerpo;

                correoMensaje.Para.ForEach(d => message.To.Add(new MailAddress(d)));
                correoMensaje.Copia.ForEach(c => message.To.Add(new MailAddress(c)));
                correoMensaje.Adjuntos.ForEach(a => message.Attachments.Add(a));

                message.Subject = correoMensaje.Asunto;
                message.Body = body;
                message.IsBodyHtml = true;

                var smtpClient = new SmtpClient(_hostName)
                {
                    Port = _port,
                    Credentials = new NetworkCredential(_userName, _password)
                };
                await smtpClient.SendMailAsync(message);
            });

        }

        private static string ReadKey(string value, string folder)
        {
            Registry.LocalMachine.OpenSubKey("SOFTWARE", true);
            RegistryKey masterKey = Registry.LocalMachine.CreateSubKey("SOFTWARE\\AGROBANCO\\" + folder);
            string valueret = "";
            if (masterKey != null)
            {
                valueret = masterKey.GetValue(value).ToString();
            }
            masterKey?.Close();
            return valueret;
        }
    }
}

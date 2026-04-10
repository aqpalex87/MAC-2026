using MAC.Business.Entity.Layer.Utils;
using MAC.Data.Access.Layer.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace MAC.Data.Access.Layer.Implementation
{
    public class LaserficheRepository : ILaserficheRepository
    {
        private readonly IConfiguration _configuration;

        public LaserficheRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string ConsultarServicio(string endpoint, string strJsonBody)
        {            
            var resultado = string.Empty;

            var client = new HttpClient();

            var urlBase = _configuration.GetValue<string>("APILaserfiche");
            var builder = new UriBuilder(urlBase);
            builder.Path += $"api/{Controller.CONTROLLER_FILE}/{endpoint}";
            var url = builder.ToString();

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(url),
                Content = new StringContent(strJsonBody, Encoding.UTF8, "application/json")
            };

            using (var response = client.Send(request))
            {
                try
                {
                    response.EnsureSuccessStatusCode();
                    resultado = response.Content.ReadAsStringAsync().Result;
                }
                catch (HttpRequestException)
                {
                    resultado = response.Content.ReadAsStringAsync().Result;
                }
            }

            return resultado;
        }
    }
}

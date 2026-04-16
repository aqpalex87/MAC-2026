using MAC.Business.Logic.Layer.Implementation;
using MAC.Business.Logic.Layer.Interfaces;
using MAC.Business.Logic.Layer.Utils;
using MAC.Control.Implementation;
using MAC.Control.Interface;
using MAC.Data.Access.Layer.DB2;
using MAC.Data.Access.Layer.Implementation;
using MAC.Data.Access.Layer.Interfaces;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class CoreServices
    {
        public static void AddCoreServices(this IServiceCollection services)
        {
            services.AddScoped<IAccessControl, AccessControl>();

            services.AddScoped(typeof(DB2DataAccess));
            services.AddScoped<Notification>();

            services.AddScoped<IClienteRepository, ClienteRepository>();
            services.AddScoped<IClienteService, ClienteService>();
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IMenuRepository, MenuRepository>();
            services.AddScoped<IMenuService, MenuService>();
            services.AddScoped<IMenuRolService, MenuRolService>();
            services.AddScoped<IEmpresaRepository, EmpresaRepository>();
            services.AddScoped<IEmpresaService, EmpresaService>();
            services.AddScoped<IRolRepository, RolRepository>();
            services.AddScoped<IRolService, RolService>();
            services.AddScoped<IUsuarioRepository, UsuarioRepository>();
            services.AddScoped<IUsuarioService, UsuarioService>();
            services.AddScoped<IUniversidadRepository, UniversidadRepository>();
            services.AddScoped<IUniversidadService, UniversidadService>();
            services.AddScoped<ICiclosRepository, CiclosRepository>();
            services.AddScoped<ICiclosService, CiclosService>();
            services.AddScoped<IParametrosMaestroRepository, ParametrosMaestroRepository>();
            services.AddScoped<IParametrosMaestroService, ParametrosMaestroService>();
            services.AddScoped<IAlumnoRepository, AlumnoRepository>();
            services.AddScoped<IAlumnoService, AlumnoService>();
            services.AddScoped<ICarnetRepository, CarnetRepository>();
            services.AddScoped<ICarnetService, CarnetService>();

            services.AddScoped<ISedesService, SedesService>();
            services.AddScoped<ISedesRepository, SedesRepository>();

            services.AddScoped<IItemFlujoCajaRepository, ItemFlujoCajaRepository>();

            services.AddScoped<IParametroVersionRepository, ParametroVersionRepository>();
            services.AddScoped<IParametroVersionService, ParametroVersionService>();
            services.AddScoped<IReportesFlujoCajaRepository, ReportesFlujoCajaRepository>();
            services.AddScoped<IFlujoCajaRepository, FlujoCajaRepository>();
            services.AddScoped<IFlujoCajaService, FlujoCajaService>();
            services.AddScoped<ISolicitudCreditoRepository, SolicitudCreditoRepository>();
            services.AddScoped<ISolicitudCreditoService, SolicitudCreditoService>();
            //services.AddScoped<IReporteFlujoCajaService, ReporteFlujoCajaService>();
            services.AddScoped<IItemFlujoCajaService, ItemFlujoCajaService>();

            services.AddScoped<IHojaProductoRepository, HojaProductoRepository>();
            services.AddScoped<IHojaProductoService, HojaProductoService>();

            services.AddScoped<ILoginExternoRepository, LoginExternoRepository>();
            services.AddScoped<ILoginExternoService, LoginExternoService>();

            services.AddScoped<ILaserficheRepository, LaserficheRepository>();            
        }
    }
}

using Implementation.Interfaces.Authentication;
using Implementation.Services.Authentication;
using MembershipImplementation.Interfaces.Configuration;
using MembershipImplementation.Services.Configuration;
using MembershipImplementation.Interfaces.HRM;
using MembershipImplementation.Services.HRM;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MembershipImplementation.Interfaces.Message;
using MembershipImplementation.Interfaces.Users;
using MembershipImplementation.Services.Message;
using MembershipImplementation.Services.Users;


namespace MembershipImplementation.Datas
{
    public static class ServiceExtenstions
    {
        public static IServiceCollection AddCoreBusiness(this IServiceCollection services)
        {
            services.AddScoped<IAuthenticationService, AuthenticationService>();
         
            services.AddScoped<IGeneralConfigService, GeneralConfigService>();
            services.AddScoped<IMemberService, MemberService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddHttpClient();

            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IEventMessageService, EventMessageService>();

            #region             
            services.AddScoped<IRegionService, RegionService>();
            services.AddScoped<IZoneService, ZoneService>();
         
            services.AddScoped<IMembershipTypeService, MembershipTypeService>();
            services.AddScoped<IDropDownService, DropDownService>();
            services.AddScoped<IAnnouncmentService, AnnouncmentService>();
           


            #endregion


            return services;
        }
    }
}

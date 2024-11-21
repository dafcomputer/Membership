using Implementation.Helper;
using MembershipImplementation.DTOS.Configuration;
using MembershipImplementation.DTOS.Users;
using MembershipInfrustructure.Model.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MembershipInfrustructure.Data.EnumList;

namespace MembershipImplementation.Interfaces.Users
{
    public interface IDashboardService
    {

        Task<DashboardNumericalDTo> GetNumbericalData(FilterCriteriaDto filterCriteriaDto);


    }



}

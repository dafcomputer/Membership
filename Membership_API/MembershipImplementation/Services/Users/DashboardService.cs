using MembershipImplementation.DTOS.Users;
using MembershipImplementation.Interfaces.Users;
using MembershipInfrustructure.Data;
using MembershipInfrustructure.Model.Users;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MembershipInfrustructure.Data.EnumList;

namespace MembershipImplementation.Services.Users
{
    public class DashboardService : IDashboardService
    {
        public readonly ApplicationDbContext _dbContext;

        public DashboardService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<DashboardNumericalDTo> GetNumbericalData(FilterCriteriaDto filterCriteria)
        {
            try
            {

                DashboardNumericalDTo dashboardNumericalDTo = new DashboardNumericalDTo();

                // Build base query for members
                var memberQuery = _dbContext.Members.AsQueryable();
                if ( filterCriteria.RegionId != null && filterCriteria.RegionId.ToLower() != "all")
                {
                    memberQuery = memberQuery.Where(m => m.RegionId == Guid.Parse(filterCriteria.RegionId));
                }
                if (filterCriteria.Gender != null && filterCriteria.Gender.ToLower() != "all")
                {
                    memberQuery = memberQuery.Where(m => m.Gender == Enum.Parse<Gender>(filterCriteria.Gender));
                }

                // Calculate Total Members
                dashboardNumericalDTo.TotalMembers = await memberQuery.CountAsync();

                // Build base query for payments
                var paymentQuery = _dbContext.MemberPayments.AsQueryable();
                if (filterCriteria.RegionId != null&& filterCriteria.RegionId.ToLower() != "all")
                {
                    paymentQuery = paymentQuery.Where(mp => mp.Member.RegionId == Guid.Parse(filterCriteria.RegionId));
                }
                if (filterCriteria.Gender != null && filterCriteria.Gender.ToLower()!="all")
                {
                    paymentQuery = paymentQuery.Where(mp => mp.Member.Gender == Enum.Parse<Gender>(filterCriteria.Gender));
                }
                if (filterCriteria.PaymentStatus != null &&filterCriteria.PaymentStatus.ToLower()!="all")
                {
                    paymentQuery = paymentQuery.Where(mp => mp.PaymentStatus == Enum.Parse<PaymentStatus>(filterCriteria.PaymentStatus));
                }

                // Calculate Pending Members
                dashboardNumericalDTo.PendingMembers = await paymentQuery
                    .Where(mp => mp.PaymentStatus == PaymentStatus.PENDING)
                    .GroupBy(mp => mp.MemberId)
                    .CountAsync();

                // Calculate Revenue (Assuming Revenue is total of all successful payments)
                dashboardNumericalDTo.Revenue = await paymentQuery
                    .Where(mp => mp.IsPaid)
                    .SumAsync(mp => mp.Payment);

                // Calculate Receivable (Assuming Receivable is total of all pending payments)
                dashboardNumericalDTo.Receivable = await paymentQuery
                    .Where(mp => mp.PaymentStatus == PaymentStatus.PENDING)
                    .SumAsync(mp => mp.Payment);

                return dashboardNumericalDTo;




            }
            catch (Exception ex)
            {

                return new DashboardNumericalDTo();
            }
        }


    }
}

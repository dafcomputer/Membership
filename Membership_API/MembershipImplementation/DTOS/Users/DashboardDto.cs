using MembershipInfrustructure.Model.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MembershipInfrustructure.Data.EnumList;

namespace MembershipImplementation.DTOS.Users
{

    public record FilterCriteriaDto
    {
        public string? RegionId { get; set; }
        public string? Gender { get; set; }
        public string? PaymentStatus { get; set; }
    }
    public record DashboardNumericalDTo
    {

        public int TotalMembers { get; set; }
        public int PendingMembers { get; set; }
        public double Revenue { get; set; }
        public double Receivable { get; set; }

    }
}

using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MembershipInfrustructure.Data.EnumList;

namespace MembershipInfrustructure.Model.Authentication
{
    public class ApplicationUser : IdentityUser
    {
        public Guid? MemberId { get; set; }
        public Guid? AdminId { get; set; }
        public RowStatus RowStatus { get; set; }
     
    }
}

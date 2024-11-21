using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MembershipInfrustructure.Data.EnumList;

namespace MembershipInfrustructure.Model.Authentication
{
    public class WithIdModel
    {
        public Guid Id { get; set; }
        public DateTime CreatedDate { get; set; } 
        public string CreatedById { get; set; }    
    
        public RowStatus Rowstatus { get; set; }
    }

    public class WithIdModel2
    {
        public Guid Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public RowStatus Rowstatus { get; set; }
    }
}

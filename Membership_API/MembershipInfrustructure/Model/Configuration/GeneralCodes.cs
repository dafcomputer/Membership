using MembershipInfrustructure.Model.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MembershipInfrustructure.Data.EnumList;

namespace MembershipInfrustructure.Model.Configuration
{
    public class GeneralCodes : WithIdModel
    {
        public GeneralCodeType GeneralCodeType { get; set; }
        public string InitialName { get; set; } = null!;
        public int Pad { get; set; }
        public int CurrentNumber { get; set; }
    }
}

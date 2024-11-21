using MembershipInfrustructure.Model.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MembershipInfrustructure.Model.Users
{
    public class MemberPayment
    {

        public Guid Id { get; set; }
        public Guid MemberId { get; set; }
        public virtual  Member Member { get; set; }

        public string Text_Rn { get; set; }
        public string Url { get; set; }
        public double Payment { get; set; }

        public Guid MembershipTypeId { get; set; }
        public virtual MembershipType MembershipType { get; set; }

        public DateTime ExpiredDate { get; set; }
        public DateTime LastPaid { get; set; }

        public PaymentStatus PaymentStatus { get; set; }

  
        public DateTime? ModifiedDate { get; set; } = DateTime.Now;

        [DefaultValue(false)]
        public bool IsPaid { get; set; }


    }

    public enum PaymentStatus
    {
        PENDING,
        PAID,
        EXPIRED
    }
}

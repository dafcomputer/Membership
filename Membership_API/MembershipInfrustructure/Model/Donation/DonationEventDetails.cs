using System.ComponentModel;
using MembershipInfrustructure.Model.Authentication;
using MembershipInfrustructure.Model.Users;

namespace MembershipInfrustructure.Model.Donation;

public class DonationEventDetails : WithIdModel2
{
    
    public Guid DonationEventId { get; set; }
    
    public virtual DonationEvent DonationEvent { get; set; }
    
    public string PhoneNumber { get; set; }
    
    public string TransactionId { get; set; }
    
    public string Text_Rn { get; set; }
    
    public string Url { get; set; }
    
    public double Payment { get; set; }
    
    public PaymentStatus PaymentStatus { get; set; }

    [DefaultValue(false)]
    public bool IsPaid { get; set; }
  
    
}
using System.ComponentModel;
using MembershipInfrustructure.Model.Authentication;

namespace MembershipInfrustructure.Model.Donation;

public class DonationEvent : WithIdModel2
{
    
    public string Title { get; set; }
    
    public string? SubTitle { get; set; }
    
    public string ? Description { get; set; }
    
    [DefaultValue(false)]
    public bool IsDonation { get; set; }
    
    [DefaultValue(0.0)]
    public double Amount { get; set; }
    
}
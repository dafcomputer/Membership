using MembershipInfrustructure.Model.Authentication;

namespace MembershipInfrustructure.Model.Configuration;

public class CompanyProfile : WithIdModel
{
    
    public string Title { get; set; }
    
    public string LocalTitle { get; set; }
    
    public string DashboardImagePath { get; set; }
    
    public string AboutUsLogoPath { get; set; }
    
    
    public string Description { get; set; }
    
    public string LocalDescription { get; set; }
    public string AboutUs { get; set; }
    
    public string LocalAboutUs { get; set; }
}
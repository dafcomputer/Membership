using MembershipInfrustructure.Model.Authentication;


namespace MembershipInfrustructure.Model.Configuration
{
    public class Announcment : WithIdModel
    {
        public string? ImagePath { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set;}
        public DateTime EpiredDate { get; set;}


    }
}

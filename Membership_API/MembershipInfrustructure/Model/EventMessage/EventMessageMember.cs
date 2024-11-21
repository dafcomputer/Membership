using MembershipInfrustructure.Model.Authentication;
using MembershipInfrustructure.Model.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MembershipInfrustructure.Model.Users;


namespace MembershipInfrustructure.Model.Message;

public class EventMessageMember : WithIdModel2
{
    
    public Guid MemberId { get; set; }
    
    public virtual Member Member { get; set; }
    
    public Guid EventMessageId { get; set; }
    
    public virtual EventMessage EventMessage { get; set; } 
    
    public MessageStatus MessageStatus { get; set; }
    
}
public enum MessageStatus
{
    Pending,
    Approved,
    Sent
}
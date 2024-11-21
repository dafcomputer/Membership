using MembershipInfrustructure.Model.Authentication;
using MembershipInfrustructure.Model.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace MembershipInfrustructure.Model.Message;

public class EventMessage:WithIdModel2
{
    public string Content { get; set; }
    
    public MessageType MessageType { get; set; }
    
    public bool IsApproved { get; set; }
  
}

public enum MessageType
{
    Both,
    Email, 
    SMS
}
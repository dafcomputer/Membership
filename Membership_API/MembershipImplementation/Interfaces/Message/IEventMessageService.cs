using MembershipImplementation.DTOS.EventMessage;
using MembershipInfrustructure.Model.Message;

namespace MembershipImplementation.Interfaces.EventMessage;

public interface IEventMessageService
{
    
    Task<string> AddEventMessage(EventMessagePostDto eventMessage);
    Task<EventMessageGetDto> GetEventMessage(bool? isApproved);
    Task<string> AddEventMessageMember(EventMessageMemberPostDto eventMessageMember);
    Task<EventMessageMemberGetDto> GetEventMessageMember(MessageStatus messageStatus);
    

    
}
using Implementation.Helper;
using MembershipImplementation.DTOS.EventMessage;
using MembershipInfrustructure.Model.Message;

namespace MembershipImplementation.Interfaces.Message;

public interface IEventMessageService
{
    Task<ResponseMessage<string>> AddEventMessage(EventMessagePostDto eventMessagePost); 
    
    Task<ResponseMessage<string>> UpdateEventMessage(EventMessageGetDto eventMessageGet); 
    Task<ResponseMessage<List<EventMessageGetDto>>> GetEventMessage(bool isApproved);
    Task<ResponseMessage<string>> AddEventMessageMember(EventMessageMemberPostDto eventMessageMember);
    Task<ResponseMessage<List<EventMessageMemberGetDto>>> GetEventMessageMember(MessageStatus? messageStatus, Guid? eventMessageId);
    
    Task<ResponseMessage<string>> ChangeMessageStatus ( List<Guid> memberMessageIds);

    public Task<ResponseMessage<List<EventMessageMemberGetDto>>> GetUnsentMessages();
}
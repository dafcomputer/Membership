using MembershipImplementation.DTOS.EventMessage;
using MembershipImplementation.Interfaces.EventMessage;
using MembershipInfrustructure.Data;

namespace MembershipImplementation.Services.EventMessage;

public class EventMessageService : IEventMessageService
{
    
    public readonly ApplicationDbContext _dbContext;

    public EventMessageService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<string> AddEventMessage(EventMessagePostDto eventMessage)
    {
        try
        {
            
        }
        catch (Exception ex)
        {
            return ExceptionHandler.HandleException<string>(ex);
        }
    }

}
using Implementation.Helper;
using MembershipImplementation.DTOS.EventMessage;
using MembershipImplementation.DTOS.Telegram;
using MembershipImplementation.Interfaces.Configuration;
using MembershipImplementation.Interfaces.Telegram;
using MembershipInfrustructure.Data;

namespace MembershipImplementation.Services.Telegram;

public class TelegramService : ITelegramService
{
    public readonly ApplicationDbContext _dbContext;
    
    public TelegramService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ResponseMessage<string>> UpdateMember(TelegramConnectRequest connectRequest)
    {
        try
        {
            var member = await _dbContext.Members.FindAsync( connectRequest.userId);

            if (member == null)
            {
                return new ResponseMessage<string>()
                {
                    Success = false, Message = "User not found!"
                };
            }
            member.ChatId = connectRequest.chatId;

            await _dbContext.SaveChangesAsync();


            return new ResponseMessage<string>()
            {
                Success = true,
                Message = "User Update Successfully."
            };


        }
        catch (Exception ex)
        {
            return ExceptionHandler.HandleException<string>(ex);
        }
    }
    
    
}
using Implementation.Helper;
using MembershipImplementation.DTOS.Telegram;

namespace MembershipImplementation.Interfaces.Telegram;

public interface ITelegramService
{

    Task<ResponseMessage<string>> UpdateMember(TelegramConnectRequest connectRequest);
}
using Implementation.Helper;
using MembershipImplementation.DTOS.EventMessage;
using MembershipImplementation.Helper;
using MembershipImplementation.Interfaces.Configuration;
using MembershipImplementation.Interfaces.Message;
using MembershipImplementation.Services.Configuration;
using MembershipInfrustructure.Data;
using MembershipInfrustructure.Model.Message;
using Microsoft.EntityFrameworkCore;

namespace MembershipImplementation.Services.Message;

public class EventMessageService : IEventMessageService
{
    
    public readonly ApplicationDbContext _dbContext;

    private readonly IEmailService _emailService;

    private readonly IGeneralConfigService _generalConfig;

    public EventMessageService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
        _emailService = _emailService;
        _generalConfig = _generalConfig; 
    }

    public async Task<ResponseMessage<string>> AddEventMessage(EventMessagePostDto eventMessagePost)
    {
        try
        {
            var eventMessage = new EventMessage
            {
                Id = Guid.NewGuid(),
                CreatedDate = DateTime.UtcNow,
                MessageType = eventMessagePost.MessageType,
                Content = eventMessagePost.Content,
                IsApproved = false,
                Rowstatus = EnumList.RowStatus.ACTIVE
            };

            await _dbContext.EventMessages.AddAsync(eventMessage);
            await _dbContext.SaveChangesAsync();

            return new ResponseMessage<string>
            {
                Success = true,
                Message = "Message created successfully!",
                Data = eventMessage.Id.ToString()
            };
        }
        catch (Exception ex)
        {
            return ExceptionHandler.HandleException<string>(ex);
        }
    }


    public async Task<ResponseMessage<string>> UpdateEventMessage(EventMessageGetDto eventMessageGetDto)
    {
        try
        {
            var eventMessage = await _dbContext.EventMessages
                .FirstOrDefaultAsync(x => x.Id == eventMessageGetDto.MessageId);

            if (eventMessage == null)
            {
                return new ResponseMessage<string>
                {
                    Success = false,
                    Message = "Event Message not found!"
                };
            }

            if (eventMessage.IsApproved)
            {
                return new ResponseMessage<string>
                {
                    Success = false,
                    Message = "Message already approved!"
                };
            }

            // Update only if needed
            eventMessage.Content = eventMessageGetDto.Content;
            eventMessage.IsApproved = eventMessageGetDto.IsApproved;
            eventMessage.MessageType = eventMessageGetDto.MessageType;

            await _dbContext.SaveChangesAsync();

            return new ResponseMessage<string>
            {
                Success = true,
                Message = "Message updated successfully!"
            };
        }
        catch (Exception ex)
        {
            return ExceptionHandler.HandleException<string>(ex);
        }
    }

    public async Task<ResponseMessage<List<EventMessageGetDto>>> GetEventMessage(bool isApproved)
    {
        try
        {
            var eventMessages = await _dbContext.EventMessages
                .AsNoTracking()
                .Where(x => x.IsApproved == isApproved)
                .Select(x => new EventMessageGetDto
                {
                    MessageId = x.Id,
                    MessageTypeGet = x.MessageType.ToString(),
                    MessageType = x.MessageType,
                    IsApproved = x.IsApproved
                })
                .ToListAsync();

            return new ResponseMessage<List<EventMessageGetDto>>
            {
                Success = true,
                Message = "Event messages retrieved successfully!",
                Data = eventMessages
            };
        }
        catch (Exception ex)
        {
            return ExceptionHandler.HandleException<List<EventMessageGetDto>>(ex);
        }
    }


    public async Task<ResponseMessage<string>> AddEventMessageMember(EventMessageMemberPostDto eventMessageMemberPost)
    {
        try
        {
            if (eventMessageMemberPost.ForAllMembers)
            {
                var eventMessageMembers = await _dbContext.Members
                    .Select(member => new EventMessageMember
                    {
                        Id = Guid.NewGuid(),
                        CreatedDate = DateTime.UtcNow,
                        MessageStatus = MessageStatus.Pending,
                        EventMessageId = eventMessageMemberPost.EventMessageId,
                        MemberId = member.Id,
                        Rowstatus = EnumList.RowStatus.ACTIVE
                    })
                    .ToListAsync();

                await _dbContext.EventMessageMembers.AddRangeAsync(eventMessageMembers);
                await _dbContext.SaveChangesAsync();
            }

            return new ResponseMessage<string>
            {
                Success = true,
                Message = "Members message added successfully!"
            };
        }
        catch (Exception ex)
        {
            return ExceptionHandler.HandleException<string>(ex);
        }
    }

    public async Task<ResponseMessage<List<EventMessageMemberGetDto>>> GetEventMessageMember(MessageStatus messageStatus, Guid? eventMessageId)
    {
        try
        {
            var query = _dbContext.EventMessageMembers
                .AsNoTracking()
                .Include(x => x.Member)
                .Include(x => x.EventMessage)
                .Where(x => x.MessageStatus == messageStatus);

            if (eventMessageId.HasValue)
            {
                query = query.Where(x => x.EventMessageId == eventMessageId.Value);
            }

            var eventMessageMembers = await query
                .Select(x => new EventMessageMemberGetDto
                {
                    EventMessageId = x.EventMessageId,
                    MessageStatus = x.MessageStatus,
                    MessageContent = x.EventMessage.Content,
                    MemberName = x.Member.FullName,
                    MemberPhoneNumber = x.Member.PhoneNumber,
                    MessageStatusGet = x.MessageStatus.ToString(),
                })
                .ToListAsync();

            return new ResponseMessage<List<EventMessageMemberGetDto>>
            {
                Success = true,
                Message = "Members message retrieved successfully!",
                Data = eventMessageMembers
            };
        }
        catch (Exception ex)
        {
            return ExceptionHandler.HandleException<List<EventMessageMemberGetDto>>(ex);
        }
    }


    public async Task<ResponseMessage<string>> ChangeMessageStatus(List<Guid> memberMessageIds)
{
    try
    {
        // Fetch all required member messages in a single query
        var memberMessages = await _dbContext.EventMessageMembers
            .Where(x => memberMessageIds.Contains(x.Id))
            .Include(x => x.Member)
            .Include(x => x.EventMessage)
            .ToListAsync();

        // Filter out any null values
        memberMessages = memberMessages.Where(mm => mm != null).ToList();

        // Parallel tasks for sending emails and messages
        var emailTasks = new List<Task>();
        var messageTasks = new List<Task>();

        foreach (var memberMessage in memberMessages)
        {
            var message = memberMessage.EventMessage.Content;

            if (memberMessage.EventMessage.MessageType == MessageType.Both || 
                memberMessage.EventMessage.MessageType == MessageType.Email)
            {
                var email = new EmailMetadata(
                    memberMessage.Member.Email,
                    "ABI-ZEER COMMUNITY",
                    $"{message}\nThank you.\n\nSincerely,\n\nExecutive Director"
                );
                emailTasks.Add(_emailService.Send(email));
            }

            if (memberMessage.EventMessage.MessageType == MessageType.Both || 
                memberMessage.EventMessage.MessageType == MessageType.SMS)
            {
                var messageRequest = new MessageRequest
                {
                    PhoneNumber = memberMessage.Member.PhoneNumber,
                    Message = message
                };
                messageTasks.Add(_generalConfig.SendMessage(messageRequest));
            }

            // Update status in-memory, bulk save will happen outside the loop
            memberMessage.MessageStatus = MessageStatus.Sent;
        }

        // Await all email and message tasks concurrently
        await Task.WhenAll(emailTasks);
        await Task.WhenAll(messageTasks);

        // Save all status updates in a single database transaction
        await _dbContext.SaveChangesAsync();

        return new ResponseMessage<string>
        {
            Success = true,
            Message = "Members event messages sent successfully!"
        };
    }
    catch (Exception ex)
    {
        return ExceptionHandler.HandleException<string>(ex);
    }
}

}
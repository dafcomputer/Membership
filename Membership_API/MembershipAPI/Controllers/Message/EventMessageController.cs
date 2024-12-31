using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MembershipImplementation.DTOS.EventMessage;
using MembershipImplementation.Interfaces.Message;
using MembershipInfrustructure.Model.Message;

namespace MembershipAPI.Controllers.Message
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EventMessagesController : ControllerBase
    {
        private readonly IEventMessageService _eventMessageService;

        public EventMessagesController(IEventMessageService eventMessageService)
        {
            _eventMessageService = eventMessageService;
        }

        [HttpPost]
        public async Task<IActionResult> AddEventMessage([FromBody] EventMessagePostDto eventMessagePost)
        {
            var result = await _eventMessageService.AddEventMessage(eventMessagePost);
            if (result.Success)
                return Ok(result);
            
            return BadRequest(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateEventMessage([FromBody] EventMessageGetDto eventMessageGet)
        {
            var result = await _eventMessageService.UpdateEventMessage(eventMessageGet);
            if (result.Success)
                return Ok(result);
            
            return BadRequest(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetEventMessage([FromQuery] bool isApproved)
        {
            var result = await _eventMessageService.GetEventMessage(isApproved);
            if (result.Success)
                return Ok(result);
            
            return BadRequest(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddEventMessageMember(EventMessageMemberPostDto eventMessageMember)
        {
            var result = await _eventMessageService.AddEventMessageMember(eventMessageMember);
            if (result.Success)
                return Ok(result);
            
            return BadRequest(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetEventMessageMember([FromQuery] MessageStatus? messageStatus, [FromQuery] Guid? eventMessageId)
        {
            var result = await _eventMessageService.GetEventMessageMember(messageStatus, eventMessageId);
            if (result.Success)
                return Ok(result);
            
            return BadRequest(result);
        }

        [HttpPut]
        public async Task<IActionResult> ChangeMessageStatus([FromBody] List<Guid> memberMessageIds)
        {
            var result = await _eventMessageService.ChangeMessageStatus(memberMessageIds);
            if (result.Success)
                return Ok(result);
            
            return BadRequest(result);
        }
        
        
        [HttpGet]
        public async Task<IActionResult> GetUnsentMessages()
        {
            var result = await _eventMessageService.GetUnsentMessages();
            if (result.Success)
                return Ok(result);
            
            return BadRequest(result);
        }
    }
}

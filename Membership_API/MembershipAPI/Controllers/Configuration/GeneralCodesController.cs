using Implementation.Helper;
using MembershipImplementation.DTOS.Configuration;
using MembershipImplementation.Interfaces.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace MembershipDigitalAPI.Controllers.Configuration
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeneralCodesController : ControllerBase
    {

        IGeneralConfigService _generalConfigService;

        public GeneralCodesController(IGeneralConfigService generalConfigService)
        {
            _generalConfigService = generalConfigService;
        }


        [HttpGet]
        [ProducesResponseType(typeof(GeneralCodeDto), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetGeneralCodesList()
        {
            return Ok(await _generalConfigService.GenerateCode(0,"FULL"));
        }

        [HttpPost]
        [ProducesResponseType(typeof(GeneralCodeDto), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> SenMessage(MessageRequest messageRequest)
        {
            return Ok(await _generalConfigService.SendMessage(messageRequest));
        }
    }
}

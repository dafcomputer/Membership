using System.Net;
using MembershipImplementation.DTOS.Configuration;
using MembershipImplementation.Interfaces.Configuration;
using Microsoft.AspNetCore.Mvc;

namespace MembershipAPI.Controllers.Configuration;


[Route("api/[controller]/[action]")]
[ApiController]
public class CompanyProfileController :ControllerBase
{
        ICompanyProfileService _companyProfileService;

        public CompanyProfileController(ICompanyProfileService companyProfileService)
        {
            _companyProfileService = companyProfileService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(CompanyProfileGetDto), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetCompanyProfile()
        {
            return Ok(await _companyProfileService.GetCompanyProfile());
        }
        
        
        [HttpPost]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> AddCompanyProfile([FromForm] CompanyProfilePostDto companyProfileDto)
        {
            return Ok(await _companyProfileService.UpdateCompanyProfile(companyProfileDto));
        }

}
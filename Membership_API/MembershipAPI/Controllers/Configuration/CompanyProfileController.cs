namespace MembershipAPI.Controllers.Configuration;

public class CompanyProfileController_ts
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AnnouncmentController : ControllerBase
    {

        IAnnouncmentService _AnnouncmentService;

        public AnnouncmentController(IAnnouncmentService AnnouncmentService)
        {
            _AnnouncmentService = AnnouncmentService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(AnnouncmentGetDto), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAnnouncmentList()
        {
            return Ok(await _AnnouncmentService.GetAnnouncmentList());
        }

}
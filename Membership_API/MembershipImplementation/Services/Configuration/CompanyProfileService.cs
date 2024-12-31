using Implementation.Helper;
using MembershipImplementation.DTOS.Configuration;
using MembershipImplementation.Interfaces.Configuration;
using MembershipInfrustructure.Data;
using MembershipInfrustructure.Model.Configuration;
using Microsoft.EntityFrameworkCore;

namespace MembershipImplementation.Services.Configuration;

public class CompanyProfileService:ICompanyProfileService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IGeneralConfigService _generalConfigService;

    public CompanyProfileService(ApplicationDbContext dbContext, IGeneralConfigService generalConfigService)
    {
        _generalConfigService = generalConfigService;
        _dbContext = dbContext;
    }


    public async Task<ResponseMessage<string>> UpdateCompanyProfile(CompanyProfilePostDto companyProfilePost)
    {

        try
        {
            var dashboardImagePath = "";
            var aboutImagePath = "";

            if (companyProfilePost.DashboardImage != null)
            {
                dashboardImagePath = await _generalConfigService.UploadFiles(companyProfilePost.DashboardImage, "Dashboard", "CompanyProfile");
            }

            if (companyProfilePost.AboutUsLogoPath != null)
            {
                aboutImagePath = await _generalConfigService.UploadFiles(companyProfilePost.AboutUsLogoPath, "aboutUs", "CompanyProfile");
            }


            var Id = "";
            var companyProfileDto = await _dbContext.CompanyProfile.FirstOrDefaultAsync();

            if (companyProfileDto != null)
            {
                Id = companyProfileDto.Id.ToString();
                companyProfileDto.Title = companyProfilePost.Title;
                companyProfileDto.LocalTitle =companyProfilePost.LocalTitle;
                companyProfileDto.LocalDescription =companyProfilePost.LocalDescription;
                companyProfileDto.LocalAboutUs =companyProfilePost.LocalAboutUs;
                companyProfileDto.Description = companyProfilePost.Description;
                companyProfileDto.AboutUs = companyProfilePost.AboutUs;
                companyProfileDto.DashboardImagePath =companyProfilePost.DashboardImage != null? dashboardImagePath:companyProfileDto.DashboardImagePath;
                companyProfileDto.AboutUsLogoPath =companyProfilePost.AboutUsLogoPath != null? aboutImagePath:companyProfileDto.AboutUsLogoPath;
                
                await _dbContext.SaveChangesAsync();
            }
            else
            {

                var companyProfile = new CompanyProfile()
                {
                    Id = Guid.NewGuid(),
                    DashboardImagePath = dashboardImagePath,
                    AboutUsLogoPath = aboutImagePath,

                    Title = companyProfilePost.Title,
                    Description = companyProfilePost.Description,
                    AboutUs = companyProfilePost.AboutUs,
                    
                    LocalTitle =companyProfilePost.LocalTitle,
                    LocalDescription =companyProfilePost.LocalDescription,
                    LocalAboutUs = companyProfilePost.LocalAboutUs,
                    
                    CreatedById = companyProfilePost.CreatedById,
                };
                
                await _dbContext.CompanyProfile.AddAsync(companyProfile);
                await _dbContext.SaveChangesAsync();
                
                Id= companyProfile.Id.ToString();  
            }



            return new ResponseMessage<string>()
            {
                Success = true,
                Data = Id,
                Message = "Company Profile Updated Successfully."
            };


        }
        catch (Exception ex)
        {

            return ExceptionHandler.HandleException<string>(ex);
        }
    }

    public async Task<ResponseMessage<CompanyProfileGetDto>> GetCompanyProfile()
    {
        try
        {

            var companyprofile = await _dbContext.CompanyProfile.Select((x =>

                new CompanyProfileGetDto
                {

                    Id = x.Id,
                    Title = x.Title,
                    Description = x.Description,
                    DashboardImagePath = x.DashboardImagePath,
                    AboutLogoPath = x.AboutUsLogoPath,
                    AboutUs = x.AboutUs,
                    MembersCount =  _dbContext.Members.Count(),
                    EventsPerYear = _dbContext.EventMessages.Count(),
                    
                    LocalTitle =x.LocalTitle,
                    LocalDescription =x.LocalDescription,
                    LocalAboutUs = x.LocalAboutUs,

                    
                })).FirstOrDefaultAsync();

            return new ResponseMessage<CompanyProfileGetDto>()
            {
                Success = true ,
                Data = companyprofile
            };

        }
        catch (Exception ex)
        {
            return ExceptionHandler.HandleException<CompanyProfileGetDto>(ex);
        }
    }
}
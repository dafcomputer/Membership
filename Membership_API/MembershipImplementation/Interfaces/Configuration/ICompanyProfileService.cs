using Implementation.Helper;
using MembershipImplementation.DTOS.Configuration;

namespace MembershipImplementation.Interfaces.Configuration;

public interface ICompanyProfile
{
    Task<ResponseMessage<string>> UpdateCompanyProfile(CompanyProfilePostDto companyProfilePost);
    Task<ResponseMessage<CompanyProfileGetDto>>  GetCompanyProfile();

}
using MembershipImplementation.DTOS.Configuration;
using MembershipImplementation.Interfaces.Configuration;
using MembershipInfrustructure.Data;
using MembershipInfrustructure.Model.Configuration;
using Microsoft.EntityFrameworkCore;

namespace MembershipImplementation.Services.Configuration
{
    public class DropDownService : IDropDownService
    {
        private readonly ApplicationDbContext _dbContext;

        public DropDownService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        
        public async Task<List<SelectListDto>> GetRegionDropdownList(string countryType)
        {
            var countryTypee = Enum.Parse<CountryType>(countryType);
            var regionList = await _dbContext.Regions.Where(x => x.CountryType == countryTypee).AsNoTracking().Select(x => new SelectListDto
            {
                Id = x.Id,
                Name = x.RegionName,
            }).ToListAsync();

            return regionList;
        }

        public async Task<List<SelectListDto>> GetZoneDropdownList(Guid regionID)
        {
            var ZoneList = await _dbContext.Zones.Where(x => x.RegionId == regionID).AsNoTracking().Select(x => new SelectListDto
            {
                Id = x.Id,
                Name = x.ZoneName,

            }).ToListAsync();

            return ZoneList;
        }
        


        public async Task<List<SelectListDto>> GetMembershipTypesDropDown(MemberShipTypeCategory category)
        {
          
            var membershipTypes = await _dbContext.MembershipTypes
                .Where(x => x.MemberShipTypeCategory == category)
                .AsNoTracking()
                .Select(x => new SelectListDto
                {
                    Id = x.Id,
                    Name = $"{x.Name} {x.Money}{x.Currency}/{x.Counter} {(x.MemberShipTypeCategory == MemberShipTypeCategory.WEEKLY ? "WEEKS" : x.MemberShipTypeCategory == MemberShipTypeCategory.MONTHLY ? "MONTHS" : "YEARS")}",
                    Amount = x.Money
                })
                .ToListAsync();

            return membershipTypes;
        }
        
        
        

    }
}

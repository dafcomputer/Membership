using Implementation.Helper;
using MembershipImplementation.DTOS.Configuration;
using MembershipImplementation.Interfaces.Configuration;
using MembershipInfrustructure.Data;
using MembershipInfrustructure.Model.Configuration;
using Microsoft.EntityFrameworkCore;
using static MembershipInfrustructure.Data.EnumList;

namespace MembershipImplementation.Services.Configuration
{
    public class MembershipTypeService : IMembershipTypeService
    {
        private readonly ApplicationDbContext _dbContext;

        public MembershipTypeService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<ResponseMessage<Guid>> AddMembershipType(MembershipTypePostDto membershipTypePost)
        {

            try
            {
                MembershipType membershipType = new MembershipType
                {
                    Id = Guid.NewGuid(),
                    Name = membershipTypePost.Name,
                    ShortCode = membershipTypePost.ShortCode,
                    Counter = membershipTypePost.Counter,
                    Money = membershipTypePost.Money,
                    Description = membershipTypePost.Description,
                    MemberShipTypeCategory = membershipTypePost.MembershipCategory,
                    Currency = membershipTypePost.Currency,
                    CreatedById = membershipTypePost.CreatedById,
                    Rowstatus = RowStatus.ACTIVE
                };

                await _dbContext.MembershipTypes.AddAsync(membershipType);
                await _dbContext.SaveChangesAsync();

                return new ResponseMessage<Guid>
                {
                    Data = membershipType.Id,
                    Message = "Added Successfully",
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return ExceptionHandler.HandleException<Guid>(ex);
            }
        }


        public async Task<List<MembershipTypeGetDto>> GetMembershipTypeList()
        {
            var membershipTypeList = await _dbContext.MembershipTypes.AsNoTracking().Select(x =>
                new MembershipTypeGetDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    ShortCode = x.ShortCode,
                    Counter = x.Counter,
                    Money = x.Money,
                    Currency = x.Currency,
                    CurrencyGet = x.Currency.ToString(),
                    Description = x.Description,
                    MembershipCategoryGet = x.MemberShipTypeCategory.ToString(),
                    MembershipCategory = x.MemberShipTypeCategory
                }).ToListAsync();

            return membershipTypeList;
        }

        public async Task<ResponseMessage> UpdateMembershipType(MembershipTypeGetDto membershipTypePost)
        {
            var currentMembershipType = await _dbContext.MembershipTypes.FirstOrDefaultAsync(x => x.Id == membershipTypePost.Id);

            if (currentMembershipType != null)
            { 
                currentMembershipType.Name = membershipTypePost.Name;
                currentMembershipType.Description = membershipTypePost.Description;
                currentMembershipType.Counter = membershipTypePost.Counter;
                currentMembershipType.ShortCode = membershipTypePost.ShortCode;
                currentMembershipType.Money = membershipTypePost.Money;
                currentMembershipType.Currency = membershipTypePost.Currency;
                currentMembershipType.MemberShipTypeCategory = membershipTypePost.MembershipCategory;
                await _dbContext.SaveChangesAsync();
                return new ResponseMessage { Data = currentMembershipType, Success = true, Message = "Updated Successfully" };
            }
            return new ResponseMessage { Success = false, Message = "Unable To Find MembershipType" };
        }


        public async Task<ResponseMessage> DeleteMembershipType(Guid membershipTypeId)
        {
            var currentMembershipType = await _dbContext.MembershipTypes.FindAsync(membershipTypeId);

            if (currentMembershipType != null)
            {
                _dbContext.Remove(currentMembershipType);

                await _dbContext.SaveChangesAsync();
                return new ResponseMessage { Data = currentMembershipType, Success = true, Message = "Deleted Successfully" };
            }
            return new ResponseMessage { Success = false, Message = "Unable To Find MembershipType" };


        }
    }
}

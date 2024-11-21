using Implementation.DTOS.Authentication;
using Implementation.Helper;
using Implementation.Interfaces.Authentication;
using MembershipImplementation.DTOS.Configuration;
using MembershipImplementation.Interfaces.Configuration;
using MembershipInfrustructure.Data;
using MembershipInfrustructure.Model.Authentication;
using MembershipInfrustructure.Model.Configuration;
using MembershipInfrustructure.Model.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MembershipInfrustructure.Data.EnumList;

namespace MembershipImplementation.Services.Configuration
{
    public class RegionService : IRegionService
    {

        private readonly ApplicationDbContext _dbContext;

         private UserManager<ApplicationUser> _userManager;

        public RegionService(ApplicationDbContext dbContext,   UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }


        public async Task<ResponseMessage<string>> AddRegion(RegionPostDto regionPost)
        {
            try
            {
                Region region = new Region
                {
                    Id = Guid.NewGuid(),
                    RegionName = regionPost.RegionName,
                    CountryType = regionPost.CountryType,
                    CreatedById = regionPost.CreatedById,
                    Rowstatus = RowStatus.ACTIVE
                };

                await _dbContext.Regions.AddAsync(region);
                await _dbContext.SaveChangesAsync();

                return new ResponseMessage<string>
                {
                    Data = region.Id.ToString(),
                    Message = "Added Successfully",
                    Success = true
                };
            }
            catch (Exception ex)
            {

                return ExceptionHandler.HandleException<string>(ex);
            }
        }


        public async Task<ResponseMessage<List<RegionGetDto>>> GetRegionList()
        {
            try
            {
                var regionList = await _dbContext.Regions
                    .AsNoTracking()
                    .GroupJoin(
                        _dbContext.Admins.AsNoTracking(),
                        region => region.Id,
                        admin => admin.RegionId,
                        
                        (region, admins) => new RegionGetDto
                        {
                            Id = region.Id,
                            RegionName = region.RegionName,
                            CountryTypeGet = region.CountryType.ToString(),
                            CountryType = region.CountryType,
                            UserName = admins.Select(a => a.FullName).FirstOrDefault() ?? "" // Get the first matching admin name, if any
                        }
                    )
                    .ToListAsync();

                return new ResponseMessage<List<RegionGetDto>>
                {
                    Data = regionList,
                    Success = true,
                    Message = "Successfully retrieved",
                };

            }
            catch (Exception ex)
            {
                return ExceptionHandler.HandleException<List<RegionGetDto>>(ex);
            }
        }

        public async Task<ResponseMessage<string>> UpdateRegion(RegionPostDto regionPost)
        {
            try
            {
 var currentRegion = await _dbContext.Regions.FirstOrDefaultAsync(x => x.Id == regionPost.Id);

            if (currentRegion != null)
            {
                currentRegion.RegionName = regionPost.RegionName;
                currentRegion.CountryType = regionPost.CountryType;

                await _dbContext.SaveChangesAsync();


                if (regionPost.UserName != null)
                {
                    var adminregion = await _dbContext.Admins.Where(x => x.RegionId == currentRegion.Id).ToListAsync();

                    if (!adminregion.Any())
                    {
                        var admin = new Admin
                        {

                            Id = Guid.NewGuid(),
                            ImagePath = "/wwwroot/user/default.png",
                            Email = regionPost.UserName + "@abizeer.com",
                            FullName = regionPost.UserName,
                            CreatedById = currentRegion.CreatedById,
                            CreatedDate = DateTime.Now,
                            RegionId = currentRegion.Id,

                        };

                        _dbContext.Admins.Add(admin);
                        await _dbContext.SaveChangesAsync();



                        var applicationUser = new ApplicationUser
                        {
                            AdminId = admin.Id,
                            Email = admin.Email,
                            UserName = regionPost.UserName,
                            RowStatus = RowStatus.ACTIVE,
                        };

                        var response = await _userManager.CreateAsync(applicationUser, regionPost.Password);
                        await _dbContext.SaveChangesAsync();

                        var roles = new List<string>();
                        roles.Add("RegionAdmin");

                        await _userManager.AddToRolesAsync(applicationUser, roles);
                        await _dbContext.SaveChangesAsync();
                    }

                    else
                    {
                        var user = _dbContext.Users.FirstOrDefault(x => x.UserName == adminregion.FirstOrDefault().FullName);

                        if (user != null)
                        {
                            _dbContext.RemoveRange(user);
                            _dbContext.RemoveRange(adminregion);
                            _dbContext.SaveChanges();
                        }


                        var admin = new Admin
                        {

                            Id = Guid.NewGuid(),
                            ImagePath = "/wwwroot/user/default.png",
                            Email = regionPost.UserName + "@abizeer.com",
                            FullName = regionPost.UserName,
                            CreatedById = currentRegion.CreatedById,
                            CreatedDate = DateTime.Now,
                            RegionId = currentRegion.Id,

                        };

                        _dbContext.Admins.Add(admin);
                        await _dbContext.SaveChangesAsync();



                        var applicationUser = new ApplicationUser
                        {
                            AdminId = admin.Id,
                            Email = admin.Email,
                            UserName = regionPost.UserName,
                            RowStatus = RowStatus.ACTIVE,
                        };

                        if (regionPost.Password != null)
                        {

                            var response = await _userManager.CreateAsync(applicationUser, regionPost.Password);
                            await _dbContext.SaveChangesAsync();

                            var roles = new List<string>();
                            roles.Add("RegionAdmin");

                            await _userManager.AddToRolesAsync(applicationUser, roles);
                            await _dbContext.SaveChangesAsync();
                        }


                    }
                }

                return new ResponseMessage<string> { Data = currentRegion.Id.ToString(), Success = true, Message = "Updated Successfully" };
            }
            return new ResponseMessage<string> { Success = false, Message = "Unable To Find Region" };
            }
            catch (Exception ex)
            {
                return ExceptionHandler.HandleException<string>(ex);
            }
        }
        public async Task<ResponseMessage<string>> DeleteRegion(Guid regionId)
        {
            try
            { var currentRegion = await _dbContext.Regions.FindAsync(regionId);

                if (currentRegion != null)
                {
                

                    var adminRegions = _dbContext.Admins.Where(x => x.RegionId == regionId).ToList();

                    foreach(var adminRegion in adminRegions)
                    {
                        var user = _dbContext.Users.FirstOrDefault(x => x.UserName == adminRegion.FullName);

                        if (user != null)
                        {
                            _dbContext.RemoveRange(user);

                        }
                        _dbContext.RemoveRange(adminRegion);
                        _dbContext.SaveChanges();
                    }
             
                    _dbContext.Remove(currentRegion);

                    await _dbContext.SaveChangesAsync();
                    return new ResponseMessage<string> { Data = currentRegion.Id.ToString(), Success = true, Message = "Deleted Successfully" };
                }
                return new ResponseMessage<string> { Success = false, Message = "Unable To Find Region" };


            }
            catch (Exception ex)
            {
                return ExceptionHandler.HandleException<string>(ex);
            }

        }

    }
}

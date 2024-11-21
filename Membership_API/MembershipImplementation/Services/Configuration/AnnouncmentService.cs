using Implementation.Helper;
using MembershipImplementation.DTOS.Configuration;
using MembershipImplementation.Interfaces.Configuration;
using MembershipInfrustructure.Data;
using MembershipInfrustructure.Model.Configuration;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MembershipInfrustructure.Data.EnumList;

namespace MembershipImplementation.Services.Configuration
{
    public class AnnouncmentService : IAnnouncmentService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IGeneralConfigService _generalConfigService;

        public AnnouncmentService(ApplicationDbContext dbContext, IGeneralConfigService generalConfigService)
        {
            _generalConfigService = generalConfigService;
            _dbContext = dbContext;
        }


        public async Task<ResponseMessage> AddAnnouncment(AnnouncmentPostDto AnnouncmentPost)
        {

            var imagePath = "";

            if (AnnouncmentPost.Image != null)
                imagePath = await _generalConfigService.UploadFiles(AnnouncmentPost.Image, AnnouncmentPost.Title, "Announcment");
            Announcment Announcment = new Announcment
            {
                Id = Guid.NewGuid(),
                ImagePath = imagePath,
                Title = AnnouncmentPost.Title,
                Description = AnnouncmentPost.Description,
                EpiredDate= AnnouncmentPost.EpiredDate,
                CreatedDate =DateTime.Now,
                CreatedById = AnnouncmentPost.CreatedById,
                Rowstatus = RowStatus.ACTIVE
            };

            await _dbContext.Announcments.AddAsync(Announcment);
            await _dbContext.SaveChangesAsync();

            return new ResponseMessage
            {
                Data = Announcment,
                Message = "Added Successfully",
                Success = true
            };
        }


        public async Task<List<AnnouncmentGetDto>> GetAnnouncmentList()
        {
            var AnnouncmentList = await _dbContext.Announcments.AsNoTracking().Select(x => new AnnouncmentGetDto
            {
                Id = x.Id,
                Title = x.Title,
                ImagePath = x.ImagePath,
                EpiredDate= x.EpiredDate,
                
                Description = x.Description,
            }).ToListAsync();

            return AnnouncmentList;
        }

        public async Task<ResponseMessage> UpdateAnnouncment(AnnouncmentGetDto AnnouncmentPost)
        {
            var currentAnnouncment = await _dbContext.Announcments.FirstOrDefaultAsync(x => x.Id == AnnouncmentPost.Id);

            if (currentAnnouncment != null)
            {

                currentAnnouncment.Title = AnnouncmentPost.Title;
                currentAnnouncment.Description = AnnouncmentPost.Description;

                if (AnnouncmentPost.Image != null)
                    currentAnnouncment.ImagePath = await _generalConfigService.UploadFiles(AnnouncmentPost.Image, AnnouncmentPost.Title, "Announcment");
                await _dbContext.SaveChangesAsync();
                return new ResponseMessage { Data = currentAnnouncment, Success = true, Message = "Updated Successfully" };
            }
            return new ResponseMessage { Success = false, Message = "Unable To Find Announcment" };
        }


        public async Task<ResponseMessage> DeleteAnnouncment(Guid AnnouncmentId)
        {
            var currentAnnouncment = await _dbContext.Announcments.FindAsync(AnnouncmentId);

            if (currentAnnouncment != null)
            {
                _dbContext.Remove(currentAnnouncment);

                await _dbContext.SaveChangesAsync();
                return new ResponseMessage { Data = currentAnnouncment, Success = true, Message = "Deleted Successfully" };
            }
            return new ResponseMessage { Success = false, Message = "Unable To Find Announcment" };


        }
    }
}

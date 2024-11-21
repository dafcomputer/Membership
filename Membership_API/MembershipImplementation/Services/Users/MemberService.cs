using AutoMapper;
using AutoMapper.Execution;
using AutoMapper.QueryableExtensions;
using Implementation.DTOS.Authentication;
using Implementation.Helper;
using Implementation.Interfaces.Authentication;

using MembershipImplementation.DTOS.Configuration;
using MembershipImplementation.DTOS.HRM;
using MembershipImplementation.DTOS.Payment;
using MembershipImplementation.Helper;
using MembershipImplementation.Interfaces.Configuration;
using MembershipImplementation.Interfaces.HRM;
using MembershipImplementation.Services.Configuration;
using MembershipInfrustructure.Data;
using MembershipInfrustructure.Model.Authentication;
using MembershipInfrustructure.Model.Configuration;
using MembershipInfrustructure.Model.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Reporting.NETCore;
using Microsoft.VisualBasic;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Numerics;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using static MembershipInfrustructure.Data.EnumList;
using Member = MembershipInfrustructure.Model.Users.Member;

namespace MembershipImplementation.Services.HRM
{
    public class MemberService : IMemberService
    {

        private readonly ApplicationDbContext _dbContext;
        private readonly IGeneralConfigService _generalConfig;
        private UserManager<ApplicationUser> _userManager;
        private readonly IAuthenticationService _authenticationService;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly IHttpClientFactory _httpClientFactory;
        public MemberService(ApplicationDbContext dbContext,
            UserManager<ApplicationUser> userManager,
            IAuthenticationService authenticationService,
            IEmailService emailService,
            IHttpClientFactory httpClientFactory,
            IGeneralConfigService generalConfig, IMapper mapper)
        {
            _dbContext = dbContext;
            _generalConfig = generalConfig;
            _userManager = userManager;
            _mapper = mapper;
            _authenticationService = authenticationService;
            _emailService = emailService;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<ResponseMessage<MembersGetDto>> RegisterMember(MembersPostDto memberPost)
        {
            try
            {
                Member members = new Member
                {
                    Id = Guid.NewGuid(),
                    FullName = $"{memberPost.FirstName} {memberPost.LastName}",
                    PhoneNumber = memberPost.PhoneNumber,
                    Email = memberPost.Email,
                   
                    Zone = memberPost.Zone,
                    MembershipTypeId = memberPost.MembershipTypeId,
                    Woreda = memberPost.Woreda,
                    Rowstatus = RowStatus.ACTIVE,
                    CreatedDate = DateTime.Now,
                };
                if (memberPost.RegionId != Guid.Empty)
                {
                    members.RegionId = memberPost.RegionId;
                }

                var memberType = await _dbContext.MembershipTypes.FindAsync(memberPost.MembershipTypeId);


                await _dbContext.Members.AddAsync(members);
                await _dbContext.SaveChangesAsync();


                return new ResponseMessage<MembersGetDto>
                {
                    Success = true,
                    Data = new MembersGetDto
                    {
                        Id = members.Id.ToString(),
                        FullName = members.FullName,
                        PhoneNumber = members.PhoneNumber,
                        Email = members.Email,
                        MembershipTypeId = memberPost.MembershipTypeId.ToString(),
                        Woreda = memberPost.Woreda,
                        Amount = memberType.Money,
                        Currency = memberType.Currency.ToString()

                    },
                    Message = "Added Successfully",
                 
                };
            }
            catch (Exception ex)
            {
                return ExceptionHandler.HandleException<MembersGetDto>(ex);
            }
        }

        public async Task<ResponseMessage> RegisterMemberFromBot(MembersPostDto memberPost)
        {
            try
            {
                Member members = new Member
                {
                    Id = Guid.NewGuid(),
                    FullName = $"{memberPost.FirstName} {memberPost.LastName}",
                    PhoneNumber = memberPost.PhoneNumber,
                    Email = memberPost.Email,
                    RegionId = memberPost.RegionId,
                    Zone = memberPost.Zone,
                    MembershipTypeId = memberPost.MembershipTypeId,
                    Woreda = memberPost.Woreda,
                    Rowstatus = RowStatus.ACTIVE,
                    CreatedDate = DateTime.Now,
                    
                };

                var memberType = await _dbContext.MembershipTypes.FindAsync(memberPost.MembershipTypeId);


                await _dbContext.Members.AddAsync(members);
                await _dbContext.SaveChangesAsync();


                return new ResponseMessage
                {
                    Data = new MembersGetDto
                    {
                        Id = members.Id.ToString(),
                        FullName = members.FullName,
                        PhoneNumber = members.PhoneNumber,
                        Email = members.Email,

                        MembershipTypeId = memberPost.MembershipTypeId.ToString(),
                        Woreda = memberPost.Woreda,
                    
                        Amount = memberType.Money,


                    },
                    Message = "Added Successfully",
                    Success = true
                };
            }
            catch (Exception ex)
            {
                return new ResponseMessage
                {

                    Message = ex.Message,
                    Success = false
                };
            }
        }


        public async Task<MembersGetDto> CheckPhoneNumberExist(string PhoneNumber)
        {
            var members = await _dbContext.Members.Where(x => x.PhoneNumber == PhoneNumber).Select(x =>
                 new MembersGetDto
                 {
                     Id = x.Id.ToString(),
                     FullName = x.FullName,
                     PhoneNumber = x.PhoneNumber,
                     Email = x.Email,
                     Zone = x.Zone,
                     Woreda = x.Woreda,


                 }).FirstOrDefaultAsync();
            return members;
        }

        public async Task<List<MembersGetDto>> GetMembers()
        {
            var encryption = "2B7E151628AED2A6ABF7158809CF4F3C";

            // Fetch members with related data
            var members = await _dbContext.Members
                .AsNoTracking()
                .Select(m => new
                {
                    m.Id,
                    m.FullName,
                    m.PhoneNumber,
                    m.RegionId,
                    m.ImagePath,
                    m.Email,
                    m.Zone,
                    RegionName = m.Region.RegionName,
                    m.Woreda,

                    m.MembershipType,
                    m.MembershipTypeId,
                    MembershipTypeName = m.MembershipType.Name,
                    m.MemberId,
                    m.Gender,

                    m.BirthDate,

                    m.IdCardStatus,
                    m.RejectedRemark,

                    m.CreatedDate
                })
                .ToListAsync();

            // Fetch all payments for each member
            var allMemberPayments = await _dbContext.MemberPayments
                .AsNoTracking()
                .GroupBy(p => p.MemberId)
                .Select(g => new
                {
                    MemberId = g.Key,
                    Payments = g.OrderByDescending(p => p.LastPaid)
                        .Select(p => new
                        {
                            p.Payment,
                            p.Text_Rn,
                            p.ExpiredDate,
                            p.PaymentStatus,
                            p.LastPaid
                        })
                        .ToList()
                })
                .ToDictionaryAsync(x => x.MemberId);

            // Combine the data in memory
            return members.Select(m =>
            {
                allMemberPayments.TryGetValue(m.Id, out var memberPayments);
                var payments = memberPayments?.Payments;
                var latestPayment = payments?.FirstOrDefault();
                var secondLatestPayment = payments?.Skip(1).FirstOrDefault();
                var paymentCount = payments?.Count ?? 0;
                var memberStatus = DetermineMemberStatus(paymentCount, latestPayment?.PaymentStatus, secondLatestPayment?.PaymentStatus);

                return new MembersGetDto
                {
                    Id = m.Id.ToString(),
                    FullName = m.FullName,
                    PhoneNumber = m.PhoneNumber,
                    RegionId = m.RegionId.ToString(),
                    ImagePath = m.ImagePath,
                    Email = m.Email,
                    Zone = m.Zone,
                    Region = m.RegionName,
                    Woreda = m.Woreda,

                    MembershipTypeId = m.MembershipTypeId.ToString(),
                    MembershipType = m.MembershipTypeName,
                    MemberId = m.MemberId,
                    Gender = m.Gender.ToString(),
                    Amount = latestPayment?.Payment ?? 0.0,
                    Text_Rn = latestPayment?.Text_Rn ?? "",
                    ExpiredDate = latestPayment?.ExpiredDate ?? DateTime.Now,

                    BirthDate = m.BirthDate,
                    
                    MembershipCategory = m.MembershipType.MemberShipTypeCategory.ToString(),

                    IdCardStatus = m.IdCardStatus.ToString(),
                    PaymentStatus = latestPayment?.PaymentStatus.ToString() ?? PaymentStatus.PENDING.ToString(),
                    RejectedRemark = m.RejectedRemark,
                    LastPaid = latestPayment?.LastPaid ?? DateTime.Now,

                    createdByDate = m.CreatedDate,
                    MemberStatus = memberStatus
                };
            }).ToList();
        }

        // Helper method to determine member status
        private string DetermineMemberStatus(int paymentCount, PaymentStatus? latestPaymentStatus, PaymentStatus? secondLatestPaymentStatus)
        {

            if (latestPaymentStatus == PaymentStatus.EXPIRED)
            {
                return "Waiting for Renewal";
            }

            else if (secondLatestPaymentStatus == PaymentStatus.EXPIRED)
            {
                if (latestPaymentStatus == PaymentStatus.PAID)
                {
                    return "Renewed Member";
                }
                else if (latestPaymentStatus == PaymentStatus.PENDING)
                {
                    return "Waiting for Renewal";
                }
                else
                {
                    return "Waiting for Renewal";
                }

            }



            else
            {
                return "New Member";
            }


        }
        public async Task<MembersGetDto> GetSingleMember(Guid MemberId)
        {
            var encryption = "2B7E151628AED2A6ABF7158809CF4F3C";
            var members = await (from member in _dbContext.Members.Where(x => x.Id == MemberId)
                                 join payment in _dbContext.MemberPayments on member.Id equals payment.MemberId into memberPayments
                                 let latestPayment = memberPayments.OrderByDescending(x => x.LastPaid).FirstOrDefault()
                                 select new MembersGetDto
                                 {
                                     Id = member.Id.ToString(),
                                     FullName = member.FullName,
                                     PhoneNumber = member.PhoneNumber,
                                     ImagePath = member.ImagePath,
                                     Email = member.Email,
                                     Zone = member.Zone,
                                     Region = member.Region.RegionName,
                                     Woreda = member.Woreda,
                                     Gender = member.Gender.ToString(),

                                     MembershipTypeId = member.MembershipTypeId.ToString(),
                                     MembershipType = member.MembershipType.Name,
                                     MemberId = member.MemberId,

                                     BirthDate = member.BirthDate,

                                     IdCardStatus = member.IdCardStatus.ToString(),
                                     RejectedRemark = member.RejectedRemark,
                                     ExpiredDate = latestPayment != null ? latestPayment.ExpiredDate : DateTime.Now,
                                     PaymentStatus = latestPayment != null ? latestPayment.PaymentStatus.ToString() : null,
                                     LastPaid = latestPayment != null ? latestPayment.LastPaid : DateTime.Now,
                                     Text_Rn = latestPayment != null ? latestPayment.Text_Rn : "",
                                     Amount = member.MembershipType.Money,
                                     IsBirthDate = member.IsBirthDate,


                                     createdByDate = member.CreatedDate,
                                     Currency = member.MembershipType.Currency.ToString()



                                 }).FirstOrDefaultAsync();




            return members;

        }

        public async Task<MemberPayment> GetSingleMemberPayment(Guid MemberId)
        {
            var memberPayment = await _dbContext.MemberPayments.Where(x => x.MemberId == MemberId).FirstOrDefaultAsync();

            return memberPayment;
        }

        public async Task<ResponseMessage> CompleteProfile(CompleteProfileDto Profile)
        {

            var currentMember = await _dbContext.Members.FirstOrDefaultAsync(x => x.Id == Profile.Id);
            var imagePath = "";

            if (currentMember != null)
            {

                currentMember.Gender = Enum.Parse<Gender>(Profile.Gender);
                currentMember.IsProfileCompleted = true;
                currentMember.BirthDate = Profile.BirthDate;
                if (Profile.Image != null)
                {
                    imagePath = await _generalConfig.UploadFiles(Profile.Image, currentMember.FullName, "Member");
                    currentMember.ImagePath = imagePath;
                }

                await _dbContext.SaveChangesAsync();
                return new ResponseMessage { Data = currentMember, Success = true, Message = "Profile Completed Successfully" };
            }
            return new ResponseMessage { Success = false, Message = "Unable To Find Member" };


        }

        public async Task<ResponseMessage> MakePayment(MemberPaymentDto memberPayment)
        {

            var membershipType = await _dbContext.MembershipTypes.FindAsync(memberPayment.MembershipTypeId);
            
            
            MemberPayment members = new MemberPayment
            {
                Id = Guid.NewGuid(),
                MemberId = memberPayment.MemberId,
                Url = memberPayment.Url,
                MembershipTypeId = memberPayment.MembershipTypeId,
                ExpiredDate = membershipType.MemberShipTypeCategory == MemberShipTypeCategory.WEEKLY?
                    DateTime.Now.AddDays(membershipType.Counter*7):
                    membershipType.MemberShipTypeCategory == MemberShipTypeCategory.MONTHLY?
                        DateTime.Now.AddDays(membershipType.Counter*30): DateTime.Now.AddDays(membershipType.Counter*365),
                        
                LastPaid = DateTime.Now,
                Text_Rn = memberPayment.Text_Rn,
                Payment = memberPayment.Payment,
                PaymentStatus = PaymentStatus.PENDING
            };
            var memeber = await _dbContext.Members.FindAsync(memberPayment.MemberId);

            memeber.MembershipTypeId = memberPayment.MembershipTypeId;
            await _dbContext.SaveChangesAsync();


            await _dbContext.MemberPayments.AddAsync(members);
            await _dbContext.SaveChangesAsync();
            return new ResponseMessage
            {
                Data = members,
                Message = "Added Successfully",
                Success = true
            };
        }

        public async Task<ResponseMessage> MakePaymentConfirmation(string txt_rn)
        {
            var currentPayment = await _dbContext.MemberPayments.Where(x => x.Text_Rn == txt_rn).FirstOrDefaultAsync();

            var member = await _dbContext.Members.Where(x => x.Id == currentPayment.MemberId).FirstOrDefaultAsync();
            var memberType = await _dbContext.MembershipTypes.FindAsync(member.MembershipTypeId);
            if (member != null && memberType != null && (member.MemberId == null || member.MemberId == ""))
            {
                var memberID = await _generalConfig.GenerateCode(0, memberType.ShortCode);

                while (_dbContext.Members.Any(x => x.MemberId == memberID))
                {
                    memberID = await _generalConfig.GenerateCode(0, memberType.ShortCode);

                }
                member.MemberId = memberID;
                await _dbContext.SaveChangesAsync();
                AddUSerDto addUser = new AddUSerDto
                {

                    MemberId = member.Id,
                    UserName = member.MemberId,
                    Password = "1234",



                };
                var result = await _authenticationService.AddUser(addUser);


                var message = $"Congratulation, being ABI-ZEER Member!!!\n" +
                    $"We have received your payment and would like to thank you for \n being a member of ABI-ZEER Association. \n" +
                    $"Your Membership ID is {member.MemberId} you can login through https://ABI-ZEERmms.org using the provided membership Id.";
                var email = new EmailMetadata
                                    (member.Email, "ID Card Status",
                                        $"{message}" +
                                        $"\nThank you.\n\nSincerely,\n\nExecutive Director");
                await _emailService.Send(email);
                var messageReques = new MessageRequest
                {
                    PhoneNumber = member.PhoneNumber,
                    Message = message
                };
                await _generalConfig.SendMessage(messageReques);

            }
            if (currentPayment != null)
            {


                if (currentPayment.PaymentStatus != PaymentStatus.PAID && !currentPayment.IsPaid)
                {
                    currentPayment.PaymentStatus = PaymentStatus.PAID;
                    currentPayment.IsPaid = true;

                    await _dbContext.SaveChangesAsync();




                    if (member.MemberId != null && member.MemberId != "")
                    {
                        var message = $"Congratulation, your ABI-ZEER Membership has been successfully renewed!\n" +
                                      $"We have received your payment and would like to thank you for continuing to be a valued member of the ABI-ZEER  Association.\n" +
                                      $"Your renewed Membership ID is {member.MemberId}, valid until {currentPayment.ExpiredDate.ToString("MMMM dd, yyyy")}. You can log in through https://ABI-ZEERmms.org using your Membership ID.";

                        var messageReques = new MessageRequest
                        {
                            PhoneNumber = member.PhoneNumber,
                            Message = message
                        };
                        await _generalConfig.SendMessage(messageReques);
                    }
                }

                return new ResponseMessage { Success = true, Message = "Payment Completed Successfully", Data = member };
            }
            return new ResponseMessage { Success = false, Message = "Unable To Find Payment Refernece" };

        }

        public async Task<ResponseMessage> UpdateProfile(MemberUpdateDto memberUpdate)
        {

            var currentMember = await _dbContext.Members.FirstOrDefaultAsync(x => x.Id == memberUpdate.Id);

            if (currentMember != null)
            {
                currentMember.Gender = Enum.Parse<Gender>(memberUpdate.Gender);
                currentMember.BirthDate = memberUpdate.BirthDate;
                currentMember.Woreda = memberUpdate.Woreda;

                currentMember.Email = memberUpdate.Email;

                if (memberUpdate.Image != null)
                {
                    var imagePath = await _generalConfig.UploadFiles(memberUpdate.Image, currentMember.FullName, "Member");
                    currentMember.ImagePath = imagePath;
                }


                await _dbContext.SaveChangesAsync();
                return new ResponseMessage { Data = currentMember, Success = true, Message = "Updated Successfully" };
            }
            return new ResponseMessage { Success = false, Message = "Unable To Find Member" };
        }


        public async Task<ResponseMessage> UpdateProfileFromAdmin(MemberUpdateDto memberUpdate)
{
    try
    {
        var currentMember = await _dbContext.Members
            .Include(x => x.MembershipType)
            .FirstOrDefaultAsync(x => x.Id == memberUpdate.Id);

        if (currentMember == null)
            return new ResponseMessage { Success = false, Message = "Unable To Find Member" };

        // Update basic fields
        currentMember.FullName = memberUpdate.FullName;
        currentMember.PhoneNumber = memberUpdate.PhoneNumber;
        currentMember.Email = memberUpdate.Email;
        currentMember.Gender = Enum.Parse<Gender>(memberUpdate.Gender);
        currentMember.BirthDate = memberUpdate.BirthDate;
        currentMember.Woreda = memberUpdate.Woreda;
        if (!string.IsNullOrEmpty(memberUpdate.RegionId))
            currentMember.RegionId = Guid.Parse(memberUpdate.RegionId);

        bool isMembershipTypeChanged = memberUpdate.MembershipTypeId != null &&
                                       currentMember.MembershipTypeId != memberUpdate.MembershipTypeId;

        if (memberUpdate.MembershipTypeId.HasValue)
            currentMember.MembershipTypeId = memberUpdate.MembershipTypeId.Value;

        // Upload new profile image if provided
        if (memberUpdate.Image != null)
            currentMember.ImagePath = await _generalConfig.UploadFiles(memberUpdate.Image, currentMember.FullName, "Member");

        // Process member payments
        var currentPayments = await _dbContext.MemberPayments
            .Where(x => x.MemberId == currentMember.Id)
            .OrderBy(x => x.LastPaid)
            .ToListAsync();

        var currentPayment = currentPayments.FirstOrDefault() ?? new MemberPayment
        {
            Id = Guid.NewGuid(),
            MemberId = currentMember.Id,
            MembershipTypeId = currentMember.MembershipTypeId,
            Text_Rn = "tx-ABI-ZEER-admin_register",
            Url = ""
        };

        currentPayment.PaymentStatus = Enum.Parse<PaymentStatus>(memberUpdate.PaymentStatus);
        currentPayment.LastPaid = memberUpdate.LastPaid;
        currentPayment.ExpiredDate = memberUpdate.ExpiredDate;

        if (currentPayment.PaymentStatus == PaymentStatus.PAID)
        {
            await HandlePaidMembership(currentMember, currentPayment, isMembershipTypeChanged);
        }

        if (!currentPayments.Contains(currentPayment))
            await _dbContext.MemberPayments.AddAsync(currentPayment);

        await _dbContext.SaveChangesAsync();
        return new ResponseMessage { Data = currentMember, Success = true, Message = "Updated Successfully" };
    }
    catch (Exception ex)
    {
        return new ResponseMessage { Success = false, Message = ex.Message };
    }
}

private async Task HandlePaidMembership(Member currentMember, MemberPayment currentPayment, bool isMembershipTypeChanged)
{
    var mt = await _dbContext.MembershipTypes.FindAsync(currentMember.MembershipTypeId);
    currentPayment.IsPaid = true;

    if (string.IsNullOrEmpty(currentMember.MemberId) || isMembershipTypeChanged)
    {
        var memberID = await GenerateUniqueMemberID(mt.ShortCode);
        currentMember.MemberId = memberID;

        if (isMembershipTypeChanged)
        {
            var memberUsers = await _dbContext.Users.Where(x => x.MemberId == currentMember.Id).ToListAsync();
            _dbContext.Users.RemoveRange(memberUsers);
            await _dbContext.SaveChangesAsync();
        }

        await CreateAndNotifyUser(currentMember, memberID);
    }
}

private async Task<string> GenerateUniqueMemberID(string shortCode)
{
    string memberID;
    do
    {
        memberID = await _generalConfig.GenerateCode(0, shortCode);
    } while (_dbContext.Members.Any(x => x.MemberId == memberID));

    return memberID;
}

private async Task CreateAndNotifyUser(Member member, string memberID)
{
    AddUSerDto addUser = new AddUSerDto
    {
        MemberId = member.Id,
        UserName = memberID,
        Password = "1234"
    };
    await _authenticationService.AddUser(addUser);

    var message = $"Congratulations on becoming an ABI-ZEER Member! \n" +
                  $"We have received your payment, thank you for being a part of the ABI-ZEER  Association. \n" +
                  $"Your Membership ID is {memberID}. You can log in at https://ABI-ZEERmms.org with this ID.";

    await _generalConfig.SendMessage(new MessageRequest
    {
        PhoneNumber = member.PhoneNumber,
        Message = message
    });

    var email = new EmailMetadata(member.Email, "ID Card Status",
        $"{message}\nThank you.\n\nSincerely,\nFekadu Mazengia\nExecutive Director");
    await _emailService.Send(email);
}

        public async Task<ResponseMessage> ChangeIdCardStatus(Guid memberId, string status, string? remark)
        {
            var currentMember = await _dbContext.Members.FirstOrDefaultAsync(x => x.Id == memberId);

            if (currentMember != null)
            {

                currentMember.IdCardStatus = Enum.Parse<IDCARDSTATUS>(status);
                currentMember.RejectedRemark = remark;



                if (currentMember.IdCardStatus != IDCARDSTATUS.REQUESTED)
                {
                    var message = "";
                    if (currentMember.IdCardStatus == IDCARDSTATUS.REJECTED)
                    {
                        message = $"The requested Id Card is Rejected due to  {currentMember.RejectedRemark} Please review the reason n request again !!!";
                    }
                    else
                    {
                        message = $"The requested Id Card is Accepted please go to your dashboard http://localhost:4200/"; ;
                    }

                    var email = new EmailMetadata
                                       (currentMember.Email, "ID Card Status",
                                           $"Dear {currentMember.FullName},\n\n{message}." +
                                           $"\nThank you.\n\nSincerely,\nEMIA");
                    await _emailService.Send(email);
                }




                await _dbContext.SaveChangesAsync();
                return new ResponseMessage { Data = currentMember, Success = true, Message = "Updated Successfully" };
            }
            return new ResponseMessage { Success = false, Message = "Unable To Find Member" };
        }

        public async Task<List<MembersGetDto>> RequstedIdCards()
        {

            var encryption = "2B7E151628AED2A6ABF7158809CF4F3C";
            var members = await (from member in _dbContext.Members.Include(x => x.Region).Where(x => x.IdCardStatus == IDCARDSTATUS.REQUESTED)
                                 join payment in _dbContext.MemberPayments on member.Id equals payment.MemberId into memberPayments
                                 from payment in memberPayments.DefaultIfEmpty()
                                 select new MembersGetDto
                                 {
                                     Id = member.Id.ToString(),
                                     FullName = member.FullName,
                                     PhoneNumber = member.PhoneNumber,
                                     ImagePath = member.ImagePath,
                                     Email = member.Email,
                                     Zone = member.Zone,
                                     Region = member.Region.RegionName,
                                     Woreda = member.Woreda,

                                     MembershipTypeId = member.MembershipTypeId.ToString(),
                                     MembershipType = member.MembershipType.Name,
                                     MemberId = member.MemberId,
                                     Gender = member.Gender.ToString(),
                                     Amount = payment != null ? payment.Payment : 0.0,
                                     Text_Rn = payment != null ? payment.Text_Rn : "",
                                     ExpiredDate = payment != null ? payment.ExpiredDate : DateTime.Now,

                                     BirthDate = member.BirthDate,

                                     IdCardStatus = member.IdCardStatus.ToString(),
                                     PaymentStatus = payment != null ? payment.PaymentStatus.ToString() : PaymentStatus.PENDING.ToString(),
                                     RejectedRemark = member.RejectedRemark,



                                 }).ToListAsync();

            return members;

        }




        public async Task<ResponseMessage2> CheckIfPhoneNumberExistFromBot(string phoneNumber)
        {




            var members = await _dbContext.Members.Include(x => x.MembershipType).Where(x => x.PhoneNumber == phoneNumber).FirstOrDefaultAsync();

            if (members == null)
            {
                return new ResponseMessage2
                {
                    Exist = false,

                };
            }
            else
            {
                var memberPayment = await _dbContext.MemberPayments.Where(x => x.MemberId == members.Id)
                                            .OrderByDescending(x => x.LastPaid).FirstOrDefaultAsync();


                if (memberPayment == null)
                {

                    MemberTelegramDto member = new MemberTelegramDto
                    {
                        FullName = members.FullName,
                        PhoneNumber = members.PhoneNumber,
                        Amount = members.MembershipType.Money,
                        Currency = members.MembershipType.Currency.ToString(),
                        MembershipType = members.MembershipType.Name,
                        MembershipTypeId = members.MembershipTypeId.ToString(),
                        Text_Rn = null,
                        Email = members.Email,
                        PaymentStatus = null,
                        Url = null,
                        MemberId = members.MemberId,
                        Id = members.Id,


                    };
                    return new ResponseMessage2
                    {
                        Exist = true,
                        Status = "PENDING",
                        Message = $"Membership Type is {members.MembershipType.Name.ToUpper()}, and the Price is {members.MembershipType.Money} ETB. Please Complete the payment!!!",
                        Member = member

                    };

                }
                else
                {

                    MemberTelegramDto member = new MemberTelegramDto
                    {
                        FullName = members.FullName,
                        PhoneNumber = members.PhoneNumber,
                        Currency = members.MembershipType.Currency.ToString(),
                        Email = members.Email,
                        Amount = members.MembershipType.Money,
                        MembershipType = members.MembershipType.Name,
                        MembershipTypeId = members.MembershipTypeId.ToString(),
                        Text_Rn = memberPayment.Text_Rn,
                        PaymentStatus = memberPayment.PaymentStatus.ToString(),
                        ExpiredDate = memberPayment.ExpiredDate,
                        MemberId = members.MemberId,
                        Url = memberPayment.Url,
                        Id = members.Id,


                    };
                    var todayDate = DateTime.Now;
                    var isExpired = memberPayment.ExpiredDate.Date < todayDate.Date;

                    if (isExpired)
                    {
                        return new ResponseMessage2
                        {
                            Exist = true,
                            Status = PaymentStatus.EXPIRED.ToString(),
                            Message = $"Expired on {memberPayment.ExpiredDate}",
                            Member = member

                        };
                    }

                    if (memberPayment.PaymentStatus == PaymentStatus.PAID)
                    {
                        return new ResponseMessage2
                        {
                            Exist = true,
                            Status = PaymentStatus.PAID.ToString(),
                            Message = $"Will Expired on {memberPayment.ExpiredDate}",
                            Member = member

                        };

                    }

                    return new ResponseMessage2
                    {
                        Exist = true,
                        Status = PaymentStatus.PENDING.ToString(),
                        Message = $"Membership Type is {members.MembershipType.Name.ToUpper()}, and the Price is {members.MembershipType.Money} ETB. Please Complete the payment!!!",
                        Member = member

                    };


                }
            }
        }

        public async Task UPdateExpiredDateStatus()
        {
            var todayDate = DateTime.Now;
            var tenDaysFromNow = todayDate.AddDays(10);



            var memberPayments = await _dbContext.MemberPayments.Include(x => x.Member).Where(x => x.ExpiredDate < todayDate.Date && x.PaymentStatus != PaymentStatus.EXPIRED).ToListAsync();

            var memberPayments10days = await _dbContext.MemberPayments.Include(x => x.Member)
    .Where(x => x.ExpiredDate <= tenDaysFromNow && x.PaymentStatus != PaymentStatus.EXPIRED)
    .ToListAsync();

            foreach (var payment in memberPayments)
            {
                payment.PaymentStatus = PaymentStatus.EXPIRED;
                _dbContext.SaveChangesAsync();



                var message = $"Dear ABI-ZEER Member,\n\n" +
                  $"We would like to inform you that your membership with the ABI-ZEER  Association will expire on {payment.ExpiredDate.ToString("MMMM dd, yyyy")}.\n\n" +
                  $"Please renew your membership by visiting https://ABI-ZEERmms.org and using your Membership ID: {payment.Member.MemberId}.";



                var messageReques = new MessageRequest
                {
                    PhoneNumber = payment.Member.PhoneNumber,
                    Message = message
                };
                await _generalConfig.SendMessage(messageReques);



            }

            foreach (var payment in memberPayments10days)
            {

                var message = $"Membership Expiration Warning!!!\n" +
                    $"This is a kindly reminder your Membership will expired on {payment.ExpiredDate}. \n" +
                    $"Your Membership ID is {payment.Member.MemberId} you can login through https://ABI-ZEERmms.org and extend your membership .";
                var email = new EmailMetadata
                                    (payment.Member.Email, "Membership Status",
                                        $"{message}" +
                                        $"\nThank you.\n\nSincerely,\nFekadu Mazengia\nExecutive Director");
                await _emailService.Send(email);

            }





        }




        public async Task UpdateBirthDate()
        {
            var todayDate = DateTime.Now;

            var members = await _dbContext.Members.ToListAsync();

            foreach (var member in members)
            {
                if (member.BirthDate.Date == todayDate.Date)
                {
                    member.IsBirthDate = true;

                    var message = $"ABI-ZEER Wishes You a Happy Birth Day";
                    var email = new EmailMetadata
                                        (member.Email, "Happy BirthDay",
                                            $"Dear {member.FullName},\n\n{message}." +
                                            $"\nThank you.\n\nSincerely,\nEMIA");
                    await _emailService.Send(email);
                }
                else
                {
                    member.IsBirthDate = false;
                }
                _dbContext.SaveChangesAsync();
            }

        }


        public async Task<List<MemberRegionRevenueReportDto>> GetRegionRevenueReport()
        {
            var chapters = await _dbContext.Regions.Where(x => x.CountryType == CountryType.ETHIOPIAN).ToListAsync();

            var memberPayments = await _dbContext.MemberPayments.Include(x => x.Member).Include(x => x.MembershipType).Include(x => x.Member).ThenInclude(x => x.Region).Where(x => x.Member.RegionId != null && x.PaymentStatus == PaymentStatus.PAID).ToListAsync();
            var memberPaymentsForeigns = await _dbContext.MemberPayments.Include(x => x.Member).Include(x => x.MembershipType).Where(x => x.Member.RegionId == null && x.PaymentStatus == PaymentStatus.PAID).ToListAsync();

            var membersReports = new List<MemberRegionRevenueReportDto>();

            foreach (var chapter in chapters)
            {


                var memberReport = new MemberRegionRevenueReportDto
                {
                    RegionName = chapter.RegionName,
                    RegionRevenue = memberPayments
    .Where(x => x.Member?.RegionId == chapter.Id)
    .Sum(x => x.MembershipType.Money * (x.MembershipType.Currency == Currency.ETB ? 1 : 54)),
                    Members = _dbContext.Members.Count(x => x.RegionId == chapter.Id),

                };

                membersReports.Add(memberReport);

            }
            var memberReport2 = new MemberRegionRevenueReportDto
            {
                RegionName = CountryType.FOREIGN.ToString(),
                RegionRevenue = memberPaymentsForeigns
    .Where(x => x.MembershipTypeId != null)
    .Sum(x => x.MembershipType.Money * (x.MembershipType.Currency == Currency.ETB ? 1 : 54))
,
                Members = _dbContext.Members.Count(x => x.RegionId == Guid.Empty || x.RegionId == null),
            };
            membersReports.Add(memberReport2);
            return membersReports;
        }

        public async Task<ResponseMessage> ImportMemberFormExcel(IFormFile ExcelFile)
        {

            try
            {
                int counter = 0;
                using (var package = new ExcelPackage(ExcelFile.OpenReadStream()))
                {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[0];

                    int rowCount = worksheet.Dimension.Rows;


                    for (int row = 2; row <= rowCount; row++) // Assuming the data starts from the second row
                    {
                        Member member = new Member();
                        var fullName = worksheet.Cells[row, 1].Value?.ToString() ?? string.Empty;
                        var PhoneNumber = worksheet.Cells[row, 2].Value?.ToString() ?? string.Empty;
                        var birthdateExcel = worksheet.Cells[row, 11].Value?.ToString();

                        DateTime birthDate = DateTime.Parse(birthdateExcel);
                        var result = await CheckIfPhoneNumberExistFromBot(PhoneNumber);

                        if (!result.Exist)
                        {

                            var memberID = "";

                            var paymentStatus = worksheet.Cells[row, 13].Value?.ToString().Trim() ?? string.Empty;
                            var gender = worksheet.Cells[row, 8].Value?.ToString().Trim() ?? string.Empty;

                            var memberType = worksheet.Cells[row, 3].Value?.ToString()?.Trim() ?? string.Empty;
                            var selectedMembershipType = await _dbContext.MembershipTypes.Where(x => x.ShortCode == memberType).FirstOrDefaultAsync();

                            if (selectedMembershipType == null)
                            {

                                return new ResponseMessage
                                {
                                    Data = $"Membership type {memberType} is not Found for Member {fullName}!! \n{counter} Members Added Successfully",
                                    Message = "Excel Format Error",
                                    Success = false
                                };

                            }
                            memberID = await _generalConfig.GenerateCode(0, selectedMembershipType.ShortCode);

               


                            var region = worksheet.Cells[row, 14].Value?.ToString() ?? string.Empty;
                            var selectedRegion = await _dbContext.Regions.Where(x => x.RegionName == region).FirstOrDefaultAsync();


                            member.CreatedDate = DateTime.Now;
                            member.Id = Guid.NewGuid();
                            member.FullName = fullName;
                            member.PhoneNumber = PhoneNumber;
                            member.MembershipTypeId = selectedMembershipType.Id;
                            member.Zone = worksheet.Cells[row, 4].Value?.ToString() ?? string.Empty;
                            member.Woreda = worksheet.Cells[row, 5].Value?.ToString() ?? string.Empty;
                            member.RegionId = selectedRegion != null ? selectedRegion.Id : null;

                            member.Gender = gender == "M" ? Gender.MALE : Gender.FEMALE;

                            member.BirthDate = birthDate;

                            member.MemberId = memberID;

                            await _dbContext.Members.AddAsync(member);
                            await _dbContext.SaveChangesAsync();

                            AddUSerDto addUser = new AddUSerDto
                            {

                                MemberId = member.Id,
                                UserName = member.MemberId,
                                Password = "1234",

                            };
                            var result22 = await _authenticationService.AddUser(addUser);


                            counter += 1;




                        }
                        else
                        {
                            return new ResponseMessage
                            {
                                Data = $"PhoneNumber {PhoneNumber} registerd on Member {fullName} is already Exists !! \n{counter} Members Added Successfully ",
                                Message = "Excel Format Error",
                                Success = false
                            };
                        }






                    }
                }
                return new ResponseMessage
                {
                    Data = $"{counter} Members Added Successfully!",
                    Message = "Add Successfully From Excel!!!",
                    Success = true
                };

            }
            catch (Exception ex)
            {
                return new ResponseMessage
                {

                    Message = ex.InnerException.Message,
                    Success = false
                };
            }


        }

        public async Task<ResponseMessage> DeleteMember(Guid memberId)
        {
            var member = await _dbContext.Members.FindAsync(memberId);

            if (member == null)
            {
                return new ResponseMessage
                {

                    Message = "Member Not Found!!!",
                    Success = false
                };
            }

            var MemberPayments = await _dbContext.MemberPayments.Where(x => x.MemberId == memberId).ToListAsync();


            if (MemberPayments != null)
            {
                _dbContext.MemberPayments.RemoveRange(MemberPayments);
                await _dbContext.SaveChangesAsync();
            }

            if (MemberPayments != null)
            {
                _dbContext.Members.RemoveRange(member);
                await _dbContext.SaveChangesAsync();
            }
            return new ResponseMessage
            {

                Message = "Member Deleted Successfully!!!",
                Success = true
            };

        }

        public async Task<ResponseMessage> UpdateTextReference(string oldTextRn, string newTextRn)
        {

            try
            {
                var memberPayment = await _dbContext.MemberPayments.Where(x => x.Text_Rn == oldTextRn).ToListAsync();
                if (memberPayment.Any())
                {
                    var payment = memberPayment.FirstOrDefault();
                    payment.Text_Rn = newTextRn;

                    await _dbContext.SaveChangesAsync();

                    return new ResponseMessage
                    {
                        Success = true,
                    };


                }

                return new ResponseMessage
                {
                    Success = false,
                    Message = "payment not found"
                };

            }
            catch (Exception ex)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = ex.Message
                };
            }


            throw new NotImplementedException();
        }



        public async Task<ResponseMessage> GetExpiredDate(DateTime lastPaid, Guid membershipTypeId)
        {


            try
            {

                var membershipType = await _dbContext.MembershipTypes.FindAsync(membershipTypeId);

                if (membershipType == null)
                {
                    return new ResponseMessage
                    {
                        Success = false,
                        Message = "Membership type not found."
                    };
                }


                var expiredDate = membershipType.MemberShipTypeCategory == MemberShipTypeCategory.WEEKLY
                    ?
                    lastPaid.AddDays(membershipType.Counter * 7)
                    : membershipType.MemberShipTypeCategory == MemberShipTypeCategory.MONTHLY
                        ? lastPaid.AddDays(membershipType.Counter * 30)
                        : lastPaid.AddDays(membershipType.Counter * 365);
                    
                    
                   



                return new ResponseMessage
                {
                    Success = true,
                    Data = expiredDate
                };




            }
            catch (Exception ex)
            {

                return new ResponseMessage
                {
                    Success = false,
                    Message = ex.Message
                };
            }

        }


    }
}

using Implementation.Helper;
using MembershipImplementation.DTOS.Configuration;
using MembershipImplementation.DTOS.HRM;
using MembershipImplementation.DTOS.Payment;
using MembershipInfrustructure.Model.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MembershipImplementation.Interfaces.HRM
{
    public interface IMemberService
    {
        Task<ResponseMessage<MembersGetDto>> RegisterMember(MembersPostDto memberPost);
        Task<MembersGetDto> CheckPhoneNumberExist(string PhoneNumber);

        Task<ResponseMessage> UpdateTextReference(string oldTextRn, string newTextRn);

        Task<List<MembersGetDto>> GetMembers();
        Task<MembersGetDto> GetSingleMember(Guid MemberId);
        Task<MemberPayment> GetSingleMemberPayment(Guid MemberId);
        Task<ResponseMessage> CompleteProfile(CompleteProfileDto Profile);

        Task<ResponseMessage> MakePayment(MemberPaymentDto memberPayment);

        Task<ResponseMessage> MakePaymentConfirmation(string txt_rn);

        Task<ResponseMessage> UpdateProfile(MemberUpdateDto memberUpdate);
        Task<ResponseMessage> ChangeIdCardStatus(Guid memberId, string status, string? remark);
        Task<List<MembersGetDto>> RequstedIdCards();
        Task<ResponseMessage2> CheckIfPhoneNumberExistFromBot(string phoneNumber);
        Task<ResponseMessage> UpdateProfileFromAdmin(MemberUpdateDto memberUpdate);



        Task UPdateExpiredDateStatus();
        Task UpdateBirthDate();


        Task<List<MemberRegionRevenueReportDto>> GetRegionRevenueReport();
        Task<ResponseMessage> ImportMemberFormExcel(IFormFile ExcelFile);
        Task<ResponseMessage> DeleteMember(Guid MemberId);
        Task<ResponseMessage> GetExpiredDate(DateTime lastPaid, Guid membershipTypeId);



    }
}

using Implementation.Helper;
using MembershipImplementation.Interfaces.Configuration;
using MembershipInfrustructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MembershipImplementation.Services.Configuration
{
    public class GeneralConfigService : IGeneralConfigService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;

        public GeneralConfigService(ApplicationDbContext dbContext, IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<string> GenerateCode(EnumList.GeneralCodeType GeneralCodeType, string memberType)
        {
            var curentCode = await _dbContext.GeneralCodes.FirstOrDefaultAsync(x => x.GeneralCodeType == GeneralCodeType);
            if (curentCode != null)
            {

                var randomNumber = new Random().Next((int)Math.Pow(10, curentCode.Pad - 1), (int)Math.Pow(10, curentCode.Pad) - 1);
                var generatedCode = $"{curentCode.InitialName}-{memberType}-{randomNumber}";

                curentCode.CurrentNumber += 1;
                await _dbContext.SaveChangesAsync();
                return generatedCode;
            }
            return "";
        }

        public async Task<string> GetFiles(string path)
        {
            byte[] imageArray = await File.ReadAllBytesAsync(path);
            string imageRepresentation = Convert.ToBase64String(imageArray);
            return imageRepresentation.ToString();
        }

        public async Task<string> UploadFiles(IFormFile formFile, string Name, string FolderName)
        {
            var path = Path.Combine("wwwroot", FolderName);
            string pathToSave = Path.Combine(Directory.GetCurrentDirectory(), path);

            if (!Directory.Exists(pathToSave))
                Directory.CreateDirectory(pathToSave);

            if (formFile != null && formFile.Length > 0)
            {
                try
                {
                    string fileExtension = Path.GetExtension(formFile.FileName);
                    string fileName = $"{Name}{fileExtension}";
                    string filePath = Path.Combine(pathToSave, fileName);

                    if (File.Exists(filePath))
                        File.Delete(filePath);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await formFile.CopyToAsync(stream);
                    }

                    var newPath = Path.Combine(path, fileName);
                    return newPath;
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }
            }

            return "";
        }




        public string Encrypt(string text, string encryptionKey)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Encoding.UTF8.GetBytes(encryptionKey);
                aesAlg.IV = new byte[16]; // Initialization Vector (IV)

                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            swEncrypt.Write(text);
                        }
                    }

                    return Convert.ToBase64String(msEncrypt.ToArray());
                }
            }
        }

        public string Decrypt(string encryptedText, string encryptionKey)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Encoding.UTF8.GetBytes(encryptionKey);
                aesAlg.IV = new byte[16]; // Initialization Vector (IV)

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msDecrypt = new MemoryStream(Convert.FromBase64String(encryptedText)))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            return srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
        }

        public async Task<ResponseMessage> SendMessage(MessageRequest messageRequest)
        {

            try
            {
                // Validate the token
                string token = _configuration["SMSSettings:token"];
                // Assuming you have some logic to validate the token here...

                // Get the API URL from appsettings.json
                string apiUrl = _configuration["SMSSettings:ApiUrl"];

                // Make sure apiUrl is not null or empty


                HttpClient httpClient = _httpClientFactory.CreateClient();

                // Define the Moodle API endpoint URL.


                // Create a new FormData object and add the required parameters.
                var formData = new MultipartFormDataContent();

                formData.Add(new StringContent(messageRequest.PhoneNumber), "phone");
                formData.Add(new StringContent(messageRequest.Message), "msg");
                formData.Add(new StringContent(token), "token");
                // Send the POST request to the Moodle API.
                HttpResponseMessage response = await httpClient.PostAsync(apiUrl, formData);

                if (response.IsSuccessStatusCode)
                {



                    return new ResponseMessage
                    {
                        Success = true,
                        Message = "Message sent successfully."
                    };

                }
                else
                {
                    return new ResponseMessage
                    {
                        Success = true,
                        Message = $"{(int)response.StatusCode} Failed to send message."
                    };
                    // Handle unsuccessful response

                }

            }
            catch (Exception ex)
            {

                return new ResponseMessage
                {
                    Success = true,
                    Message = $"Internal Server Error: {ex.Message}"
                };



            }
        }

    }
}


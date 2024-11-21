import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AuthGuard } from "src/app/auth/auth.guard";
import {
  IMembersGetDto,
  ICompletePorfileDto,
  MoodleUpdateDto,
} from "src/app/models/auth/membersDto";
import { UserView } from "src/app/models/auth/userDto";
import { IPaymentData, IMakePayment } from "src/app/models/payment/IPaymentDto";
import { SelectList } from "src/app/models/ResponseMessage.Model";
import { CommonService } from "src/app/services/common.service";
import { DropDownService } from "src/app/services/dropDown.service";
import { MemberService } from "src/app/services/member.service";
import { PaymentService } from "src/app/services/payment.service";
import { UserService } from "src/app/services/user.service";
import { environment } from "src/environments/environment";

import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-complete-profile",
  templateUrl: "./complete-profile.component.html",
  styleUrls: ["./complete-profile.component.scss"],
})
export class CompleteProfileComponent implements OnInit {
  @Input() memberVar: IMembersGetDto;

  returnUrl = environment.clienUrl + "/auth/payment-verfication/";

  paymentStatus: string;
  txt_rn: string;
  completeProfileForm!: FormGroup;
  user!: UserView;
  member: IMembersGetDto;
  imagePath: any = null;
  fileGH: File;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,

    private ngbModule: NgbModule,
    private commonService: CommonService,
    private dropdownService: DropDownService,
    //private confirmationService: ConfirmationService,
    private memberService: MemberService,
    private activeModal: NgbActiveModal,
    //private messageService: MessageService,
    private authGuard: AuthGuard,
    private paymentService: PaymentService
  ) {}

  educationalFields: SelectList[];
  educationalLelvels: SelectList[];

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();

    this.completeProfileForm = this.formBuilder.group({
      gender: ["", Validators.required],
      birthDate: ["", Validators.required],
    });

    if (this.memberVar.birthDate) {
      this.completeProfileForm.controls["birthDate"].setValue(
        this.memberVar.birthDate.split("T")[0]
      );
    }

    if (this.memberVar.gender) {
      this.completeProfileForm.controls["gender"].setValue(
        this.memberVar.gender
      );
    }

    this.getMember();
  }

  getMember() {
    this.memberService.getSingleMember(this.user.loginId).subscribe({
      next: (res) => {
        this.member = res;
      },
    });
  }

  renewMembership2() {
    this.paymentService.verifyPayment(this.memberVar.text_Rn).subscribe({
      next: (res) => {
        if (res.response) {
          if (res.response.status == "success") {
            this.MakePaymentConfirmation(this.memberVar.text_Rn);
          } else {
            var payment: IPaymentData = {
              amount: this.memberVar.amount,
              currency: this.memberVar.currency,
              email: this.memberVar.email,
              first_name: this.memberVar.fullName,
              last_name: "",
              phone_number: this.memberVar.phoneNumber,
              return_url: this.returnUrl,
              title: `Payment for Membership`,
              description: this.memberVar.memberId,
            };

            this.paymentService.payment(payment).subscribe({
              next: (result) => {
                this.memberService
                  .updateTextReference(
                    this.memberVar.text_Rn,
                    result.response.tx_ref
                  )
                  .subscribe({
                    next: (res) => {
                      if (res.success) {
                        window.location.href =
                          result.response.data.checkout_url;
                        this.verifyPayment();
                      }
                    },
                  });
              },
            });
          }
        } else {
          var payment: IPaymentData = {
            amount: this.memberVar.amount,
            currency: this.memberVar.currency,
            email: this.memberVar.email,
            first_name: this.memberVar.fullName,
            last_name: "",
            phone_number: this.memberVar.phoneNumber,
            return_url: this.returnUrl,
            title: `Payment for Membership`,

            description: this.memberVar.memberId,
          };

          this.paymentService.payment(payment).subscribe({
            next: (result) => {
              this.memberService
                .updateTextReference(
                  this.memberVar.text_Rn,
                  result.response.tx_ref
                )
                .subscribe({
                  next: (res) => {
                    if (res.success) {
                      window.location.href = result.response.data.checkout_url;
                      this.verifyPayment();
                    }
                  },
                });
            },
          });
        }
      },
    });
  }

  renewMembership3() {
    var payment: IPaymentData = {
      amount: this.memberVar.amount,
      currency: this.memberVar.currency,
      email: this.memberVar.email,
      first_name: this.memberVar.fullName,
      last_name: "",
      phone_number: this.memberVar.phoneNumber,
      return_url: this.returnUrl,
      title: `Payment for Membership`,
      description: this.memberVar.memberId,
    };

    this.paymentService.payment(payment).subscribe({
      next: (res) => {
        var mapayment: IMakePayment = {
          memberId: this.memberVar.id,
          membershipTypeId: this.memberVar.membershipTypeId,
          payment: payment.amount,

          text_Rn: res.response.tx_ref,
          url: res.response.data.checkout_url,
        };

        var url = res.response.data.checkout_url;
        this.makePayment(mapayment, url);
      },
    });
  }
  makePayment(makePay: IMakePayment, url: string) {
    this.paymentService.MakePayment(makePay).subscribe({
      next: (res) => {
        if (res.success) {
          //this.messageService.add({ severity: 'success', summary: 'Successfull', detail: res.message });
          window.location.href = url;
        } else {
          //this.messageService.add({ severity: 'error', summary: 'Authentication failed.', detail: res.message });
        }
      },
      error: (err) => {
        //this.messageService.add({ severity: 'error', summary: 'Something went wron!!!', detail: err.message });
      },
    });
  }

  onUpload(event: any) {
    var file: File = event.target.files[0];
    this.fileGH = file;
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.imagePath = myReader.result;
    };
    myReader.readAsDataURL(file);
  }
  getImage(url: string) {
    return this.commonService.createImgPath(url);
  }

  getImage2() {
    if (this.imagePath != null && this.imagePath != "") {
      return this.imagePath;
    }
    if (
      this.member &&
      this.member.imagePath != "" &&
      this.member.imagePath != null
    ) {
      return this.getImage(this.member.imagePath!);
    } else {
      return "../../../../../assets/logo-transparent.png";
    }
  }

  register() {
    if (
      (this.imagePath == null ||
        this.imagePath == undefined ||
        this.imagePath == "") &&
      this.memberVar.imagePath == null
    ) {
      //this.messageService.add({ severity: 'error', summary: 'Image not Found.', detail: 'Please select an image' });
      return;
    }
    if (this.completeProfileForm.valid) {
      var completeProfile: ICompletePorfileDto = {
        id: this.member.id,
        educationalLevelId: this.completeProfileForm.value.educationalLevelId,
        educationalField: this.completeProfileForm.value.educationalField,
        gender: this.completeProfileForm.value.gender,
        instituteRole: this.completeProfileForm.value.inistituteRole,
        birthDate: this.completeProfileForm.value.birthDate,
      };

      var formData = new FormData();
      for (let key in completeProfile) {
        if (completeProfile.hasOwnProperty(key)) {
          formData.append(key, (completeProfile as any)[key]);
        }
      }

      // Append the file to the form data
      formData.append("image", this.fileGH);
      this.memberService.completeProfile(formData).subscribe({
        next: (res) => {
          if (res.success) {
            //this.messageService.add({ severity: 'success', summary: 'Successfull', detail: res.message });
            this.closeModal();

            var loginForm = {
              userName: this.member.memberId,
              password: "1234",
              IsEncryptChecked: [false, Validators.required],
            };

            this.userService.login(loginForm).subscribe({
              next: (res) => {
                if (res.success) {
                  sessionStorage.setItem("token", res.data);
                  //this.messageService.add({ severity: 'success', summary: 'Successfull', detail: res.message });
                  window.location.reload();
                }
              },
            });
          } else {
            //this.messageService.add({ severity: 'error', summary: 'Something went wrong!!!.', detail: res.message });
          }
        },
        error: (err) => {
          // this.messageService.add({ severity: 'error', summary: 'Something went wrong!!!', detail: err.message });
        },
      });
    }
  }

  checkIfPhoneNumberExist(phoneNumber: string) {
    this.memberService.checkIfPhoneNumberExist(phoneNumber).subscribe({
      next: (res) => {
        if (res) {
          // this.confirmationService.confirm({
          //   message: 'You have already Registerd!! you want to proceed from where you stop ?',
          //   header: 'Phone number already registerd ',
          //   icon: 'pi pi-info-circle',
          //   accept: () => { },
          //   reject: (type: ConfirmEventType) => {
          //     switch (type) {
          //       case ConfirmEventType.REJECT:
          //         this.completeProfileForm.controls['phoneNumber'].setValue('');
          //         this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
          //         break;
          //       case ConfirmEventType.CANCEL:
          //         this.completeProfileForm.controls['phoneNumber'].setValue('');
          //         this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
          //         break;
          //     }
          //   },
          //   key: 'positionDialog'
          // });
        } else {
        }
      },
    });
  }

  verifyPayment() {
    this.memberService.getSingleMemberPayment(this.member.id).subscribe({
      next: (res) => {
        this.paymentService.verifyPayment(res.text_Rn).subscribe({
          next: (re) => {
            if (re.response) {
              if (re.response.data.status === "success") {
                this.MakePaymentConfirmation(res.text_Rn);
              }
              this.paymentStatus = re.response.data.status;
            } else {
              this.paymentStatus = re.message;
            }
          },
          error: (err) => {
            //this.messageService.add({ severity: 'success', summary: 'Successfull', detail: err });
          },
        });
      },
    });
  }
  MakePaymentConfirmation(text_rn: string) {
    this.paymentService.MakePaymentConfirmation(text_rn).subscribe({
      next: (res) => {
        window.location.reload();
      },
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  logout() {
    this.authGuard.logout();
  }

  registerMoodle() {
    const autoGeneratedId = this.commonService.generateRandomId();

    const formData = new FormData();
    const password = this.commonService.generatePassword(10);
    const userName =
      this.member.fullName.split(" ")[0].toLowerCase() +
      "_" +
      this.commonService.generatePassword(5).toLowerCase();

    formData.append("moodlewsrestformat", "json");
    formData.append("wsfunction", "core_user_create_users");
    formData.append("wstoken", "a0c0c7896b48813246e45971eaa74c21");
    formData.append("users[0][username]", userName);
    formData.append("users[0][password]", password);
    formData.append("users[0][firstname]", this.member.fullName.split(" ")[0]);
    formData.append("users[0][lastname]", this.member.fullName.split(" ")[1]);
    formData.append("users[0][email]", this.member.email);
    formData.append("users[0][idnumber]", autoGeneratedId);
    formData.append("users[0][lang]", "en");
    formData.append("users[0][description]", "If you die you die");

    this.memberService.callMoodle(formData).subscribe({
      next: (res) => {
        //this.messageService.add({ severity: 'success', summary: 'Successfull', detail: 'Your moodle Registration was successfull' });

        if (res[0]) {
          var moodleDto: MoodleUpdateDto = {
            moodleName: res[0].username,
            moodleId: res[0].id.toString(),
            memberId: this.member.id,
            moodlePassword: password,
          };
          this.updateMember(moodleDto);
        } else {
          //this.messageService.add({ severity: 'error', summary: res.debuginfo, detail: res.message });
        }
      },
    });
  }

  updateMember(updateMoodleDto: MoodleUpdateDto) {
    this.memberService.updateMoodleApi(updateMoodleDto).subscribe({
      next: (res) => {
        if (res.success) {
          // this.messageService.add({ severity: 'success', summary: 'Successfull', detail: 'Your moodle updated was successfull' });
          window.location.reload();
        } else {
          //this.messageService.add({ severity: 'error', summary: 'Something went Wrong!!!', detail: res.message });
        }
      },
      error: (err) => {
        // this.messageService.add({ severity: 'error', summary: 'Something went wrong!!', detail: err });
      },
    });
  }
}

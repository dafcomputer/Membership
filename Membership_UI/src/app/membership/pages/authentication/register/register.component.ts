import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";

import { UserService } from "src/app/services/user.service";

import { DropDownService } from "src/app/services/dropDown.service";

import { MemberService } from "src/app/services/member.service";

import { PaymentService } from "src/app/services/payment.service";
import { environment } from "src/environments/environment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IMembersPostDto } from "src/app/models/auth/membersDto";
import { UserView } from "src/app/models/auth/userDto";
import { IPaymentData, IMakePayment } from "src/app/models/payment/IPaymentDto";
import { SelectList } from "src/app/models/ResponseMessage.Model";
import { PendingMembersComponent } from "../../members/pending-members/pending-members.component";
import { errorToast } from "src/app/services/toast.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export default class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  user!: UserView;
  selectedCountry: string;
  returnUrl = environment.clienUrl + "/auth/payment-verfication/";
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private dropdownService: DropDownService,
    private modalService: NgbModal,
    private paymentService: PaymentService,
    private memberService: MemberService
  ) {}

  countries: SelectList[];
  regions: SelectList[];
  zones: SelectList[];
  memberships: SelectList[];

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      phoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern("[0-9]{10}"),
          Validators.min(10),
        ],
      ],
      email: ["", [Validators.required, Validators.email]],
      membershipType: ["", Validators.required],
      RegionId: [null, Validators.required],
      Zone: [null, Validators.required],
      woreda: [null, Validators.required],
    
    });

   
  }

  getMemberships(category: string) {
    this.dropdownService.getMembershipDropDown(category).subscribe({
      next: (res) => {
        this.memberships = res;
      },
    });
  }

  getCountries() {
    this.dropdownService.getContriesDropdown().subscribe({
      next: (res) => {
        this.countries = res;
      },
    });
  }

  getRegions(countryType: string) {
    if (countryType === "ETHIOPIAN") {
      this.registerForm.get("RegionId").setValidators(Validators.required);
      this.registerForm.get("woreda").setValidators(Validators.required);
      this.registerForm.get("Zone").setValidators(Validators.required);
      this.dropdownService.getRegionsDropdown(countryType).subscribe({
        next: (res) => {
          this.regions = res;
        },
      });
    } else {
      this.registerForm.get("RegionId").clearValidators();
      this.registerForm.get("woreda").clearValidators();
      this.registerForm.get("Zone").clearValidators();
    }

    this.registerForm.get("RegionId").updateValueAndValidity();
    this.registerForm.get("woreda").updateValueAndValidity();
    this.registerForm.get("Zone").updateValueAndValidity();
  }

  getZones(regionId: string) {
    this.dropdownService.getZonesDropdown(regionId).subscribe({
      next: (res) => {
        this.zones = res;
      },
    });
  }

  register() {

    var registerFor: IMembersPostDto = {
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      phoneNumber: this.registerForm.value.phoneNumber.toString(),
      email: this.registerForm.value.email,
      Zone: this.registerForm.value.Zone,
      RegionId: this.registerForm.value.RegionId,
      woreda: this.registerForm.value.woreda,

      membershipTypeId: this.registerForm.value.membershipType,
    };

    this.userService.register(registerFor).subscribe({
      next: (res) => {
        if (res.success) {
          var payment: IPaymentData = {
            amount: res.data.amount,
            currency: res.data.currency,
            email: res.data.email,
            first_name: res.data.fullName,
            last_name: "",
            phone_number: res.data.phoneNumber,
            return_url: this.returnUrl,
            title: `Payment for Membership`,
            description: res.data.memberId,
          };

          this.goTOPayment(payment, res.data);
        } else {

          errorToast(res.errorCode!||res.message,res.message)
          //this.messageService.add({ severity: 'error', summary: 'Something went Wrong!!!.', detail: res.message });
        }
      },
     
    });
  }

  checkIfPhoneNumberExist(phoneNumber: string) {
    this.memberService.checkIfPhoneNumberExist(phoneNumber).subscribe({
      next: (res) => {
        if (res.exist) {
          let modalRef = this.modalService.open(PendingMembersComponent, {
            size: "xl",
            backdrop: "static",
            windowClass: "custom-modal-width",
          });
          modalRef.componentInstance.memberTelegram = res;
          this.registerForm.controls["phoneNumber"].setValue("");
        } else {
        }
      },
    });
  }

  goTOPayment(payment: IPaymentData, member: any) {
    this.paymentService.payment(payment).subscribe({
      next: (res) => {

        console.log(res)
        var mapayment: IMakePayment = {
          memberId: member.id,
          membershipTypeId: member.membershipTypeId,
          payment: payment.amount,
          text_Rn: res.response.tx_ref,
          url: res.response.data.checkout_url,
        };

        var url = res.response.data.checkout_url;
        this.makePayment(mapayment, url);
      },
      error: (err) => {},
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
  loginasMember() {
    this.router.navigateByUrl("/auth/membership-login");
  }
}

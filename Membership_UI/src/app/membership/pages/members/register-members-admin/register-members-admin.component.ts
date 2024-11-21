import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { DropDownService } from "src/app/services/dropDown.service";
import { MemberService } from "src/app/services/member.service";
import { PaymentService } from "src/app/services/payment.service";
import { UserService } from "src/app/services/user.service";

import { PendingMembersComponent } from "../pending-members/pending-members.component";
import { IMembersPostDto } from "src/app/models/auth/membersDto";
import { UserView } from "src/app/models/auth/userDto";
import { SelectList } from "src/app/models/ResponseMessage.Model";
import { errorToast, successToast } from "src/app/services/toast.service";

@Component({
  selector: "app-register-members-admin",
  templateUrl: "./register-members-admin.component.html",
  styleUrls: ["./register-members-admin.component.scss"],
})
export class RegisterMembersAdminComponent implements OnInit {
  registerForm!: FormGroup;
  user!: UserView;
  selectedCountry: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activeModal: NgbActiveModal,
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
      email: ["", Validators.required],
      membershipType: ["", Validators.required],
      RegionId: [null, Validators.required],
      Zone: [null, Validators.required],
      woreda: [null, Validators.required],
    });

    //this.getCountries();
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
      this.registerForm.get("woreda").setValidators(Validators.required);
      this.registerForm.get("Zone").setValidators(Validators.required);
      this.registerForm.get("RegionId").setValidators(Validators.required);
    } else {
      this.registerForm.get("woreda").clearValidators();
      this.registerForm.get("Zone").clearValidators();
      this.registerForm.get("RegionId").clearValidators();
    }

    this.registerForm.get("woreda").updateValueAndValidity();
    this.registerForm.get("Zone").updateValueAndValidity();
    this.registerForm.get("RegionId").updateValueAndValidity();

    this.dropdownService.getRegionsDropdown(countryType).subscribe({
      next: (res) => {
        this.regions = res;
      },
    });
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
          successToast(res.message);
          // this.messageService.add({
          //   severity: "success",
          //   summary: "Successfully Registed!!!.",
          //   detail: res.message,
          // });
          this.closeModal();
        } else {
          errorToast(res.errorCode! || res.message, res.message);
          // this.messageService.add({
          //   severity: "error",
          //   summary: "Something went Wrong!!!.",
          //   detail: res.message,
          // });
        }
      },

    });
  }

  checkIfPhoneNumberExist(phoneNumber: string) {
    this.memberService.checkIfPhoneNumberExist(phoneNumber).subscribe({
      next: (res) => {
        if (res.exist) {
          this.registerForm.controls["phoneNumber"].setValue("");
        } else {
        }
      },
    });
  }

  closeModal() {
    this.activeModal.close();
  }
}

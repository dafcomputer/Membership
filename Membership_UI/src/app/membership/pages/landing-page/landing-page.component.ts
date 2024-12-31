import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { CompanyProfileGetDto } from "src/app/models/configuration/ICompanyProfileDto";
import { CommonService } from "src/app/services/common.service";
import { ConfigurationService } from "src/app/services/configuration.service";
import { errorToast, successToast } from "src/app/services/toast.service";

@Component({
  selector: "app-landing-page",

  templateUrl: "./landing-page.component.html",
  styleUrl: "./landing-page.component.scss",
})
export class LandingPageComponent implements OnInit {
  translateService: any;
  contactForm: FormGroup;
  selectedLanguage:string='en'

  companyProfileDto!: CompanyProfileGetDto;
  constructor(
    private router: Router,
    private translate: TranslateService,
    private commonService: CommonService,
    private configService: ConfigurationService,
    private formBuilder: FormBuilder
  ) {
    translate.setDefaultLang("en");
    translate.use("en"); // Change to the desired default language
  }
  switchLanguage(language: string) {
    this.selectedLanguage=language
    this.translate.use(language);
  }
  ngOnInit(): void {
    this.getCompanyProfile();

    this.contactForm = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      message: ["", [Validators.required]],
      subject: ["", [Validators.required]],
    });
  }

  getCompanyProfile() {
    this.configService.getCompanyProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.companyProfileDto = res.data;
        } else {
          console.error(res.errorCode! || res.message);
          // errorToast(res.errorCode! || res.message, res.message);
        }
      },
    });
  }
  navigateToRegister() {
    this.router.navigateByUrl("/auth/register");
  }
  contactSales() {
    throw new Error("Method not implemented.");
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.configService.AddContactus(this.contactForm.value).subscribe({
        next: (res) => {
          if (res.success) {
            successToast(res.message);
            this.contactForm.reset();
          } else {
            errorToast(res.errorCode! || res.message, res.message);
          }
        },
      });
    }
  }

  getImage(url: string) {
    return this.commonService.createImgPath(url);
  }
}

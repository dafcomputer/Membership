import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-landing-page",

  templateUrl: "./landing-page.component.html",
  styleUrl: "./landing-page.component.scss",
})
export class LandingPageComponent implements OnInit {
translateService: any;
  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
    translate.setDefaultLang("en");
    translate.use("en"); // Change to the desired default language
  }
  switchLanguage(language: string) {
    this.translate.use(language);
  }
  ngOnInit(): void {}
  navigateToRegister() {
    this.router.navigateByUrl("/auth/register");
  }
  contactSales() {
    throw new Error("Method not implemented.");
  }
  contactForm: any;
  onSubmit() {
    throw new Error("Method not implemented.");
  }
}

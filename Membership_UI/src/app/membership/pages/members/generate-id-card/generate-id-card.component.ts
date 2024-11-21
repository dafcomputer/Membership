import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "src/app/services/common.service";
import * as html2pdf from "html2pdf.js";

import { HttpClient } from "@angular/common/http";

import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { IMembersGetDto } from "src/app/models/auth/membersDto";

@Component({
  selector: "app-generate-id-card",
  templateUrl: "./generate-id-card.component.html",
  styleUrls: ["./generate-id-card.component.scss"],
})
export class GenerateIdCardComponent implements OnInit {
  @Input() member: IMembersGetDto;
  imagePath: string = "'../../../../../assets/logo-transparent.png'";
  isMobile: boolean;

  constructor(
    private commonService: CommonService,
    private http: HttpClient,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.getImage2();
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }

  getImage(url: string) {
    return this.commonService.createImgPath(url);
  }
  async getImage2() {
    if (
      this.member &&
      this.member.imagePath != "" &&
      this.member.imagePath != null
    ) {
      const imageBlob = await this.http
        .get(this.getImage(this.member.imagePath!), { responseType: "blob" })
        .toPromise();

      const imageUrl = URL.createObjectURL(imageBlob);

      this.imagePath = imageUrl;
    }
  }

  async generatePdf() {
    if (this.isMobile) {
      this.isMobile = false;
    }

    const cardElement = document.getElementById("card");

    if (cardElement) {
      const membername = `${this.member.fullName} Id Card.pdf`;

      html2pdf()
        .from(cardElement)
        .set({
          margin: 10, // Set margins (in mm)
          dpi: 300,
          pagebreak: { mode: "landscape" }, // Set the DPI (dots per inch)
        })
        .save(membername)
        .then(() => {
          this.breakpointObserver
            .observe([
              Breakpoints.Handset,
              Breakpoints.Small,
              Breakpoints.XSmall,
            ])
            .subscribe((result) => {
              this.isMobile = result.matches;
              if (this.isMobile) {
                cardElement.style.display = "none";
              }
            });
          // Handle setting this.isMobile if needed
          // For example, if you need to toggle this.isMobile after PDF generation
          // this.isMobile = false;
        })
        .catch((error) => {});
    } else {
    }
  }
}

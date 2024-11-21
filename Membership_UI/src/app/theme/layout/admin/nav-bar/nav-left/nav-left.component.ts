// Angular import
import { Component, Output, EventEmitter, OnInit } from "@angular/core";
import { Validators } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CompleteProfileComponent } from "src/app/membership/pages/authentication/complete-profile/complete-profile.component";
import { RenewMemberComponent } from "src/app/membership/pages/members/renew-member/renew-member.component";
import { IMembersGetDto } from "src/app/models/auth/membersDto";
import { UserView } from "src/app/models/auth/userDto";

import { MemberService } from "src/app/services/member.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-nav-left",
  templateUrl: "./nav-left.component.html",
  styleUrls: ["./nav-left.component.scss"],
})
export class NavLeftComponent implements OnInit {
  // public props
  @Output() NavCollapsedMob = new EventEmitter();
  user: UserView;
  member: IMembersGetDto;

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    if (this.user.role == "Member") {
      this.getMember();
    }
  }

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private memberService: MemberService
  ) {}

  getMember() {
    this.memberService.getSingleMember(this.user.loginId).subscribe({
      next: (res) => {
        this.member = res;

        this.login();
      },
    });
  }

  openModal() {
    let modalRef = this.modalService.open(CompleteProfileComponent, {
      size: "xl",
      backdrop: "static",
      keyboard: false,
      windowClass: "full-width-modal",
    });
    modalRef.componentInstance.memberVar = this.member;
  }

  openRenewModal() {
    let modalRef = this.modalService.open(RenewMemberComponent, {
      size: "xl",
      backdrop: "static",
      keyboard: false,
      windowClass: "full-width-modal",
    });
  }

  login() {
    var loginForm = {
      userName: this.member.memberId,
      password: "1234",
      IsEncryptChecked: false,
    };

    this.userService.login(loginForm).subscribe({
      next: (res) => {
        if (res.success) {
          sessionStorage.setItem("token", res.data);
          this.user = this.userService.getCurrentUser();

          if (
            this.user.isProfileCompleted.toLowerCase() == "false" ||
            this.member.paymentStatus == "PENDING"
          ) {
            this.openModal();
          }
          if (this.user.isExpired.toLowerCase() == "true") {
            this.openRenewModal();
          }
        }
      },
    });
  }
}

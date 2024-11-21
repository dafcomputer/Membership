// Angular import
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthGuard } from "src/app/auth/auth.guard";
import { EventDescriptionComponent } from "src/app/membership/pages/configuration/event-description/event-description.component";
import { UserView } from "src/app/models/auth/userDto";
import { ICourseGetDto } from "src/app/models/configuration/ICourseDto";
import { ConfigurationService } from "src/app/services/configuration.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-nav-right",
  templateUrl: "./nav-right.component.html",
  styleUrls: ["./nav-right.component.scss"],
})
export class NavRightComponent implements OnInit {
  currentUser: UserView;
  events: ICourseGetDto[];
  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();

    if (this.currentUser.role.toUpperCase() == "MEMBER") {
    //  this.getMemberEvent();
    }
  }

  constructor(
    private commonService: ConfigurationService,
    private modalService: NgbModal,
    private router: Router,
    private authGuard: AuthGuard,
    private userService: UserService
  ) {}

  // getImage(){
  //   return this.commonService.createImgPath(this.currentUser.photo)
  // }

  getMemberEvent() {
    this.commonService.getMemberEvents(this.currentUser.loginId).subscribe({
      next: (res) => {
        this.events = res;
      },
    });
  }

  eventDescription(event: ICourseGetDto) {
    let modalRef = this.modalService.open(EventDescriptionComponent, {
      size: "lg",
      backdrop: "static",
    });

    modalRef.componentInstance.event = event;
  }

  detail(eventId: string) {
    this.router.navigate(["configuration/event-detail", eventId]);
  }

  logOut() {
    this.authGuard.logout();
  }
}

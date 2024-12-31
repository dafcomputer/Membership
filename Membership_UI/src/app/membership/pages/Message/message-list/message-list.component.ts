import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserView } from "src/app/models/auth/userDto";
import { UserService } from "src/app/services/user.service";
import { AddMessageComponent } from "./add-message/add-message.component";
import { EventMessageService } from "src/app/services/message.service";
import { ImessageGetDto } from "./add-message/messageDto";
import { MessageDetailComponent } from "../message-detail/message-detail.component";

@Component({
  selector: "app-message-list",

  templateUrl: "./message-list.component.html",
  styleUrl: "./message-list.component.scss",
})
export class MessageListComponent implements OnInit {
  userView!: UserView;
  searchTerm!: string;
  eventMessages: ImessageGetDto[] = [];
  isApproved: boolean = false;

  ngOnInit(): void {
    this.userView = this.userService.getCurrentUser();
    this.getMessages();
  }

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private messageService: EventMessageService
  ) {}

  applyFilter() {}

  addMessage() {
    let modalRef = this.modalService.open(AddMessageComponent, {
      size: "lg",
      backdrop: "static",
    });

    modalRef.result.then(() => {
      this.getMessages();
    });
  }

  getMessages() {
    this.messageService.getMessages(this.isApproved).subscribe({
      next: (res) => {
        if (res.success) {
          this.eventMessages = res.data;
          console.log(this.eventMessages);
        }
      },
    });
  }

  updateMessage(message: ImessageGetDto) {
    let modalRef = this.modalService.open(AddMessageComponent, {
      size: "lg",
      backdrop: "static",
    });

    modalRef.componentInstance.message = message;

    modalRef.result.then(() => {
      this.getMessages();
    });
  }

  detailMessage(message: ImessageGetDto) {
    let modalRef = this.modalService.open(MessageDetailComponent, {
      size: "xl",
      backdrop: "static",
    });

    modalRef.componentInstance.message = message;

    modalRef.result.then(() => {
      this.getMessages();
    });
  }
}

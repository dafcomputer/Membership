import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserView } from "src/app/models/auth/userDto";
import { UserService } from "src/app/services/user.service";
import { AddMessageComponent } from "./add-message/add-message.component";
import { EventMessageService } from "src/app/services/message.service";
import { ImessageGetDto } from "./add-message/messageDto";

@Component({
  selector: "app-message-list",

  templateUrl: "./message-list.component.html",
  styleUrl: "./message-list.component.scss",
})
export class MessageListComponent implements OnInit {
  userView!: UserView;
  searchTerm!: string;
  eventMessages: ImessageGetDto[] = [];
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
    let modal = this.modalService.open(AddMessageComponent, {
      size: "lg",
      backdrop: "static",
    });
  }

  getMessages() {
    this.messageService.getMessages(true).subscribe({
      next: (res) => {
        if (res.success) {
          this.eventMessages = res.data;
          console.log(this.eventMessages)
        }
      },
    });
  }
}

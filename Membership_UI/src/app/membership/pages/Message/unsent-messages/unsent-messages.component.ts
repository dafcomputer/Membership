import { Component, OnInit } from "@angular/core";
import { EventMessageMemberGetDto } from "../message-list/add-message/messageDto";
import { EventMessageService } from "src/app/services/message.service";
import { successToast, errorToast } from "src/app/services/toast.service";
import { UserView } from "src/app/models/auth/userDto";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-unsent-messages",

  templateUrl: "./unsent-messages.component.html",
  styleUrl: "./unsent-messages.component.scss",
})
export class UnsentMessagesComponent implements OnInit {
  unsentMessages: EventMessageMemberGetDto[] = [];
  filteredMessages: EventMessageMemberGetDto[] = [];

  userView:UserView
  searchTerm:string=''

  selectedRows: EventMessageMemberGetDto[] = [];
  areAllSelected = false;

  constructor(private messsageService: EventMessageService, private userService : UserService) {}

  ngOnInit(): void {
    this.userView = this.userService.getCurrentUser()
    this.getUnsentMessages();
  }

  getUnsentMessages() {
    this.messsageService.getUnsentMessages().subscribe({
      next: (res) => {
        if (res.success) {
          this.unsentMessages = res.data;
          this.filteredMessages = [...this.unsentMessages];
        } else {
        }
      },
    });
  }


  toggleSelection(item: any) {
    const index = this.selectedRows.indexOf(item);
    if (index > -1) {
      // Remove from selection
      this.selectedRows.splice(index, 1);
    } else {
      // Add to selection
      this.selectedRows.push(item);
    }
    this.updateSelectAllStatus();
  }

  toggleSelectAll(event: any) {
    this.areAllSelected = event.target.checked;
    if (this.areAllSelected) {
      this.selectedRows = [...this.unsentMessages];
    } else {
      this.selectedRows = [];
    }
  }

  isSelected(item: any): boolean {
    return this.selectedRows.includes(item);
  }

  updateSelectAllStatus() {
    this.areAllSelected = this.selectedRows.length === this.unsentMessages.length;
  }

  send() {
    const memberIds = this.selectedRows.map(
      (item) => item.eventMessageMemberId
    );

    if (memberIds) {
      this.messsageService.changeMessageStatus(memberIds).subscribe({
        next: (res) => {
          if (res.success) {
            successToast(res.message);
            this.getUnsentMessages();
          } else {
            errorToast(res.errorCode! || res.message, res.message);
          }
        },
      });
    }
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredMessages = this.unsentMessages.filter(
      (item) =>
        item.memberName.toLowerCase().includes(term) ||
        item.memberPhoneNumber.toLowerCase().includes(term) ||
        item.messageContent.toLowerCase().includes(term) ||
        item.messageTypeGet.toLowerCase().includes(term)
    );
  }
  
}

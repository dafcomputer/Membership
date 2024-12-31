import { Component, Input, OnInit } from "@angular/core";
import {
  EventMessageMemberGetDto,
  EventMessageMemberPostDto,
  ImessageGetDto,
} from "../message-list/add-message/messageDto";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EventMessageService } from "src/app/services/message.service";
import { SelectList } from "src/app/models/ResponseMessage.Model";
import { MemberService } from "src/app/services/member.service";
import { IMembershipTypeGetDto } from "src/app/models/configuration/IMembershipDto";
import { ConfigurationService } from "src/app/services/configuration.service";
import { errorToast, successToast } from "src/app/services/toast.service";

@Component({
  selector: "app-message-detail",

  templateUrl: "./message-detail.component.html",
  styleUrl: "./message-detail.component.scss",
})
export class MessageDetailComponent implements OnInit {
  @Input() message: ImessageGetDto;
  messageStatus: number = 0;
  messageMembers: EventMessageMemberGetDto[] = [];

  membershipTypes: IMembershipTypeGetDto[] = [];

  recivertypes: SelectList[] = [
    // { code: 0, name: "Members" },
    { code: 1, name: "Membership Type" },
    { code: 2, name: "For All Members" },
  ];

  selectedReciverType: number;
  selectedMembershipTypes: string[] = [];

  constructor(
    private modalService: NgbActiveModal,
    private eventMessageService: EventMessageService,
    private configService: ConfigurationService,
    private messageService: EventMessageService
  ) {}

  ngOnInit(): void {
    this.getMessageMembers();
  }

  closeModal() {
    this.modalService.close();
  }

  getMessageMembers() {
    this.eventMessageService
      .getMessageMembers(this.messageStatus, this.message.messageId)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.messageMembers = res.data;
          }
        },
      });
  }

  getMembershipTypes() {
    this.configService.getMembershipTYpes().subscribe({
      next: (res) => {
        this.membershipTypes = res;
      },
    });
  }

  onReciverTypeSelect() {
    if (this.selectedReciverType == 1) {
      this.getMembershipTypes();
    }
  }

  submit() {
    if (this.selectedReciverType == 2 || this.selectedMembershipTypes) {
      var eventMessageMemberPostDto: EventMessageMemberPostDto = {
        membershipIds: this.selectedMembershipTypes,
        forAllMembers: this.selectedReciverType == 2 ? true : false,
        eventMessageId: this.message.messageId,
      };

      this.messageService
        .addMessageMembers(eventMessageMemberPostDto)
        .subscribe({
          next: (res) => {
            if (res.success) {
              successToast(res.message);
              this.getMessageMembers();
            } else {
              errorToast(res.errorCode! || res.message, res.message);
            }
          },
        });
    }
  }

  send() {
    const memberIds = this.messageMembers.map(
      (item) => item.eventMessageMemberId
    );

    if (memberIds) {
      this.messageService.changeMessageStatus(memberIds).subscribe({
        next: (res) => {
          if (res.success) {
            successToast(res.message);
            this.getMessageMembers();
          } else {
            errorToast(res.errorCode! || res.message, res.message);
          }
        },
      });
    }
  }
}

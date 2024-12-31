import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EnumType, SelectList } from "src/app/models/ResponseMessage.Model";
import { EventMessageService } from "src/app/services/message.service";

import { errorToast, successToast } from "src/app/services/toast.service";
import { ImessageGetDto } from "./messageDto";

@Component({
  selector: "app-add-message",
  templateUrl: "./add-message.component.html",
  styleUrl: "./add-message.component.scss",
})
export class AddMessageComponent implements OnInit {
  @Input() message: ImessageGetDto;

  messageForm: FormGroup;
  messageTypes: EnumType[] = [
    { code: 0, value: "Both" },
    { code: 1, value: "Email" },
    { code: 2, value: "SMS" },
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private messageService: EventMessageService
  ) {}
  ngOnInit(): void {
    this.messageForm = this.formBuilder.group({
      content: ["", Validators.required],
      messageType: ["", Validators.required],
      isApproved: [""],
      messageId:['']
    });
    if (this.message) {
      this.messageForm.patchValue({
        content: this.message.content,
        messageType: this.messageTypes.filter(
          (x) => x.value === this.message.messageTypeGet
        )[0].code,
        isApproved: this.message.isApproved,
        messageId:this.message.messageId
      });
    }
  }

  closeModal() {
    this.activeModal.close();
  }
  submitMessage() {
    if (this.messageForm.valid) {

      if(this.message){
        this.messageService.updateMessage(this.messageForm.value).subscribe({
          next: (res) => {
            if (res.success) {
              successToast(res.message);
              this.closeModal();
            } else {
              errorToast(res.errorCode! || res.message, res.message);
            }
          },
        });
      }else {
      this.messageService.addMessage(this.messageForm.value).subscribe({
        next: (res) => {
          if (res.success) {
            successToast(res.message);
            this.closeModal();
          } else {
            errorToast(res.errorCode! || res.message, res.message);
          }
        },
      });
    }
    }
  }
}

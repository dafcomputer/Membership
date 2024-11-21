import { Component, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MemberService } from "src/app/services/member.service";
import { errorToast, successToast } from "src/app/services/toast.service";

@Component({
  selector: "app-delete-confirmation",
  standalone: true,
  imports: [],
  templateUrl: "./delete-confirmation.component.html",
  styleUrl: "./delete-confirmation.component.scss",
})
export class DeleteConfirmationComponent {
  @Input() memberIdToDelete: string = "";

  constructor(
    private controlService: MemberService,
    private activeModal: NgbActiveModal
  ) {}

  confirmDelete() {
    this.controlService.deleteMember(this.memberIdToDelete).subscribe({
      next: (res) => {
        if (res.success) {
          successToast(res.message);
          this.closeModal();
          // this.messageService.this.getMembers(); // Refresh member list
        } else {
          //errorToast(res.err)
          //this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
        }
      },
    });
    this.closeModal();
  }

  closeModal() {
    this.activeModal.close();
  }
}

import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { CommonService } from "src/app/services/common.service";
import { ConfigurationService } from "src/app/services/configuration.service";
import { MemberService } from "src/app/services/member.service";

import { MemberDetailComponent } from "./member-detail/member-detail.component";
import { RegisterMembersAdminComponent } from "./register-members-admin/register-members-admin.component";
import { UserService } from "src/app/services/user.service";
import { IMembersGetDto } from "src/app/models/auth/membersDto";
import { UserView } from "src/app/models/auth/userDto";
import { DeleteConfirmationComponent } from "../delete-confirmation/delete-confirmation.component";

@Component({
  selector: "app-members",
  templateUrl: "./members.component.html",
  styleUrls: ["./members.component.scss"],
})
export class MembersComponent implements OnInit {
  first: number = 0;
  rows: number = 5;
  Members: IMembersGetDto[] = [];
  paginatedMembers: IMembersGetDto[] = [];
  searchTerm: string = "";
  selectedFile: File | null = null;
  user: UserView;
  ngOnInit(): void {
    this.getMemberss();
    this.user = this.userService.getCurrentUser();
  }

  constructor(
    private modalService: NgbModal,
    private commonService: CommonService,

    private userService: UserService,
    private controlService: MemberService
  ) {}

  getMemberss() {
    this.controlService.getMembers().subscribe({
      next: (res) => {
        this.Members = res;
        console.log(this.Members);

        this.paginateMembers();
      },
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.paginateMembers();
  }

  getImagePath(url: string) {
    return this.commonService.createImgPath(url);
  }

  paginateMembers() {
    this.paginatedMembers = this.Members.slice(
      this.first,
      this.first + this.rows
    );
  }

  applyFilter() {
    const searchTerm = this.searchTerm.toLowerCase();

    this.paginatedMembers = this.Members.filter((item) => {
      return (
        item.fullName.toLowerCase().includes(searchTerm) ||
        item.phoneNumber.toLowerCase().includes(searchTerm) ||
        (item.memberId &&
          item.memberId.toLocaleLowerCase().includes(searchTerm)) ||
        item.membershipType.toLowerCase().includes(searchTerm) ||
        (item.region && item.region.toLowerCase().includes(searchTerm)) ||
  
        (item.gender && item.gender.toLowerCase().includes(searchTerm)) ||
        item.paymentStatus.toLowerCase().includes(searchTerm) ||
        item.expiredDate.toString().includes(searchTerm)
      );
    });
  }

  goToDetail(member: IMembersGetDto) {
    let modalRef = this.modalService.open(MemberDetailComponent, {
      size: "xxl",
      backdrop: "static",
      windowClass: "custom-modal-width",
    });
    modalRef.componentInstance.member = member;
    modalRef.result.then(() => {
      this.getMemberss();
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    if (!this.selectedFile) {
      return;
    }
    this.importFromExcel();
  }
  importFromExcel() {
    const formData = new FormData();
    formData.append("ExcelFile", this.selectedFile);
    this.controlService.importFromExcel(formData).subscribe({
      next: (res) => {
        if (res.success) {
          // this.messageService.add({ severity: 'success', summary: res.message, detail: res.data })
          this.getMemberss();
        } else {
          //this.messageService.add({ severity: 'error', summary: res.message, detail: res.data })
          this.getMemberss();
        }
      },
      error: (err) => {
        //this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: err })
      },
    });
  }

  DeleteMember(memberId: string) {
    let modalRef = this.modalService.open(DeleteConfirmationComponent, {
      backdrop: "static",
    });
    modalRef.componentInstance.memberIdToDelete = memberId;

    modalRef.result.then(() => {
      this.getMemberss();
    });

    // this.confirmationService.confirm({
    //   message: 'Are You sure you want to delete this Member?',
    //   header: 'Delete Confirmation',
    //   icon: 'pi pi-info-circle',
    //   accept: () => {
    //     this.controlService.deleteMember(memberId).subscribe({
    //       next: (res) => {

    //         if (res.success) {
    //           this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: res.message });
    //           this.getMemberss()
    //         }
    //         else {
    //           this.messageService.add({ severity: 'error', summary: 'Rejected', detail: res.message });
    //         }
    //       }, error: (err) => {

    //         this.messageService.add({ severity: 'error', summary: 'Rejected', detail: err });

    //       }
    //     })

    //   },
    //   reject: (type: ConfirmEventType) => {
    //     switch (type) {
    //       case ConfirmEventType.REJECT:
    //         this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
    //         break;
    //       case ConfirmEventType.CANCEL:
    //         this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
    //         break;
    //     }
    //   },
    //   key: 'positionDialog'
    // });
  }

  RegisterMember() {
    let modalRef = this.modalService.open(RegisterMembersAdminComponent, {
      size: "lg",
      backdrop: "static",
    });
    modalRef.result.then(() => {
      this.getMemberss();
    });
  }
}

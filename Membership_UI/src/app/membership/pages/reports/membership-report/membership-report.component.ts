import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IMembersGetDto } from "src/app/models/auth/membersDto";
import { UserView } from "src/app/models/auth/userDto";
import { SelectList } from "src/app/models/ResponseMessage.Model";

import { CommonService } from "src/app/services/common.service";
import { DropDownService } from "src/app/services/dropDown.service";
import { MemberService } from "src/app/services/member.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-membership-report",
  templateUrl: "./membership-report.component.html",
  styleUrls: ["./membership-report.component.scss"],
})
export class MembershipReportComponent implements OnInit {
  first: number = 0;
  rows: number = 10;
  Members: IMembersGetDto[];
  filterdMembers: IMembersGetDto[];
  searchTerm: string = "";
  chapters: SelectList[];
  memberships: SelectList[];
  selectedMembership: String = "";

  memberType: string = "";
  @ViewChild("stockReportIframe") stockReportIframe: ElementRef;
  @ViewChild("excelTable", { static: false }) excelTable!: ElementRef;

  selectedChapter: string = "";
  selectedGender: string = "";
  selectedStatus: string = "";
  fromDate: string;
  toDate: string;

  paymentStatusData: any[];
  chartOptions: any;
  loading: boolean = true;

  genderData: any[];
  chartOptions2: any;
  loading2: boolean = true;

  membershipTypeData: any[];
  chartOptions3: any;
  loading3: boolean = true;
  userView: UserView;

  ngOnInit(): void {
    this.getMemberss();

    this.userView = this.userService.getCurrentUser();

    if (this.userView.regionId != "") {
      this.getRegions("ETHIOPIAN");
    }

    // this.getMemberReport()
  }

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private commonService: CommonService,

    private controlService: MemberService,
    private dropDownService: DropDownService
  ) {}

  getMemberss() {
    this.controlService.getMembers().subscribe({
      next: (res) => {
        this.Members = res;
        this.filterdMembers = res;

        if (this.userView.regionId != "") {
          this.applyFilter();
        }

        this.getPaymentStatusChart();
        this.getGenderChart();
        this.getMembershipTypeChart();
      },
    });
  }

  getPaymentStatusChart() {
    const paymentStatusCounts = this.filterdMembers.reduce((acc, item) => {
      acc[item.paymentStatus] = (acc[item.paymentStatus] || 0) + 1;
      return acc;
    }, {});

    this.paymentStatusData = Object.keys(paymentStatusCounts).map((key) => ({
      value: paymentStatusCounts[key],
      name: key,
    }));

    // Define chart options
    this.chartOptions = {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: this.paymentStatusData.map((item) => item.name),
      },
      series: [
        {
          name: "Payment Status",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "20",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: this.paymentStatusData,
          itemStyle: {
            color: function (params) {
              // Use a function to define custom colors
              var colors = ["#FFB970", "#198754", "#dc3545"]; // Specify your custom colors here
              return colors[params.dataIndex % colors.length];
            },
          },
        },
      ],
    };

    this.loading = false; // Hide loading indicator once the chart is rendered
  }
  getGenderChart() {
    const genderCounts = this.filterdMembers.reduce((acc, item) => {
      acc[item.gender] = (acc[item.gender] || 0) + 1;
      return acc;
    }, {});

    this.genderData = Object.keys(genderCounts).map((key) => ({
      value: genderCounts[key],
      name: key,
    }));

    // Define chart options
    this.chartOptions2 = {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: this.genderData.map((item) => item.name),
      },
      series: [
        {
          name: "Payment Status",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "20",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: this.genderData,
        },
      ],
    };

    this.loading2 = false; // Hide loading indicator once the chart is rendered
  }
  getMembershipTypeChart() {
    const membershipTypeCounts = this.filterdMembers.reduce((acc, item) => {
      acc[item.membershipType] = (acc[item.membershipType] || 0) + 1;
      return acc;
    }, {});

    this.membershipTypeData = Object.keys(membershipTypeCounts).map((key) => ({
      value: membershipTypeCounts[key],
      name: key,
    }));

    // Define chart options
    this.chartOptions3 = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: ["Membership Types"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
      },
      yAxis: {
        type: "category",
        data: this.membershipTypeData.map((item) => item.name),
      },
      series: [
        {
          name: "Membership Types",
          type: "bar",
          data: this.membershipTypeData.map((item) => item.value),
          itemStyle: {
            color: "#FF7070", // Specify the bar color
          },
        },
      ],
    };

    this.loading3 = false; // Hide loading indicator once the chart is rendered
  }
  getChapter(value: string) {
    this.dropDownService.getRegionsDropdown(value).subscribe({
      next: (res) => {
        this.chapters = res;

        if (this.userView.regionId != "") {
          this.selectedChapter = this.userView.regionId;
        }
      },
    });
  }

  getImagePath(url: string) {
    return this.commonService.createImgPath(url);
  }

  // paginateMembers() {
  //   this.paginatedMembers = this.Members.slice(this.first, this.first + this.rows);
  // }
  // paginateMembers2() {
  //   this.paginatedMembers = this.paginatedMembers.slice(this.first, this.first + this.rows);
  // }

  applyFilter() {
    this.filterdMembers = this.Members;
    if (this.selectedChapter !== "") {
      const chapterSearchTerm = this.selectedChapter.toLowerCase();
      this.filterdMembers = this.Members.filter((item) => {
        return (
          item.region && item.region.toLowerCase().includes(chapterSearchTerm)
        );
      });
    }

    if (this.selectedGender !== "") {
      const genderSearchTerm = this.selectedGender.toLowerCase();
      this.filterdMembers = this.filterdMembers.filter((item) => {
        return item.gender && item.gender.toLowerCase() == genderSearchTerm;
      });
    }

    if (this.selectedStatus !== "") {
      const statusSearchTerm = this.selectedStatus.toLowerCase();
      this.filterdMembers = this.filterdMembers.filter((item) => {
        return item.paymentStatus.toLowerCase().includes(statusSearchTerm);
      });
    }

    if (this.selectedMembership !== "") {
      const statusSearchTerm = this.selectedMembership.toLowerCase();
      this.filterdMembers = this.filterdMembers.filter((item) => {
        return item.membershipTypeId.toLowerCase() === statusSearchTerm;
      });
    }

    if (this.fromDate !== "" && this.toDate != "") {
      const statusSearchTerm = this.selectedStatus.toLowerCase();
      this.filterdMembers = this.filterdMembers.filter((item) => {
        return item.paymentStatus.toLowerCase().includes(statusSearchTerm);
      });
    }

    if (this.memberType != "") {
      const memberTypeSearchTerm = this.memberType.toLowerCase();
      this.filterdMembers = this.filterdMembers.filter((item) => {
        return item.memberStatus.toLowerCase().includes(memberTypeSearchTerm);
      });
    }

    if (this.memberType !== "") {
    }

    this.getPaymentStatusChart();
    this.getGenderChart();
    this.getMembershipTypeChart();
  }

  exportAsExcel(name: string) {
    const uri = "data:application/vnd.ms-excel;base64,";
    const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>`;
    const base64 = function (s: any) {
      return window.btoa(unescape(encodeURIComponent(s)));
    };
    const format = function (s: any, c: any) {
      return s.replace(/{(\w+)}/g, function (m: any, p: any) {
        return c[p];
      });
    };

    const table = this.excelTable.nativeElement;
    const ctx = { worksheet: "Worksheet", table: table.innerHTML };

    const link = document.createElement("a");
    link.download = `${name}.xls`;
    link.href = uri + base64(format(template, ctx));
    link.click();
  }

  getRegions(countryType: string) {
    this.getChapter(countryType);
  }

  getMemberships(category: string) {
    this.dropDownService.getMembershipDropDown(category).subscribe({
      next: (res) => {
        this.memberships = res;
      },
    });
  }

  reset() {
    this.filterdMembers = this.Members;
  }
}

import { Component, OnInit, ViewChildren, QueryList } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { DashBoardService } from "../../../services/dash_board/dash-board.service";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { CookieService } from "angular2-cookie/core";
import { HttpClient } from "@angular/common/http";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { AppSettings } from "../../../apiUrls";
import {
  AppDateAdapter,
  APP_DATE_FORMATS
} from "./../../../Utilities/date.datepicker";
import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
  MatToolbarModule,
  MatTooltipModule
} from "@angular/material";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: "app-fee-report-by-academy-and-sport",
  templateUrl: "./fee-report-by-academy-and-sport.component.html",
  styleUrls: ["./fee-report-by-academy-and-sport.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS
    }
  ]
})
export class FeeReportByAcademyAndSportComponent implements OnInit {
  constructor(
    private dashBoardService: DashBoardService,
    private cookieService: CookieService,
    private httpClient: HttpClient
  ) {}

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtTrigger1: Subject<any> = new Subject();
  reportByAcademy: any = {};
  studentPaymentsPerAcademyPerSport: any = [];
  studentPaymentsPerAcademyPerSportTotals: any = {};
  dtOptions = {};
  userDetails: any = {};
  currentLoginData: any = {};
  parentAcademyLogin = false;

  ngOnInit() {
    this.userDetails = this.cookieService.getObject("loginResponce");

    if (
      this.userDetails &&
      this.userDetails.type &&
      this.userDetails.type.toLowerCase() == "academyadmin"
    ) {
      this.currentLoginData = { academy: this.userDetails.id };
    } else if (
      this.userDetails &&
      this.userDetails.type &&
      this.userDetails.type.toLowerCase() == "parentacademy"
    ) {
      this.currentLoginData = { parentAcademy: this.userDetails.id };
      this.parentAcademyLogin = true;
    } else {
      this.getAcademiesList();
    }
    var date = new Date();
    this.reportByAcademy.startDate = new Date(date.getFullYear(), 0);
    this.reportByAcademy.endDate = new Date();
    this.dtOptions[0] = this.getDtOptions1();
    this.onActivate(event);
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

  ngAfterViewInit(): void {
    this.dtTrigger1.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger1.unsubscribe();
  }

  getDtOptions1() {
    return {
      pagingType: "full_numbers",
      pageLength: 25,
      lengthMenu: [
        [-1, 5, 10, 25, 50, 100],
        ["ALL", 5, 10, 25, 50, 100]
      ],
      serverSide: true,
      //scrollY: "500px",
      processing: true,
      retrieve: true,
      language: {
        emptyTable: "No data available in table"
      },
      title: "Datatables example: Customisation of the print view window",
      buttons: [
        // 'colvis',
        {
          extend: "print",
          text: "Print",
          title: "Fee report by Academy and sport"
        },
        {
          extend: "excel",
          text: "Excel",
          title: "Fee report by Academy and sport"
        },
        {
          extend: "pdf",
          text: "Pdf",
          title: "Fee report by Academy and sport"
        }
      ],
      ajax: (dataTablesParameters: any, callback) => {
        this.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT +
              "studentPayments/superAdminFeeReportPerAcademyPerSport",
            Object.assign(
              dataTablesParameters,
              this.reportByAcademy,
              this.currentLoginData,
              this.feeSummaryFilters
            ),
            {}
          )
          .subscribe((resp: any) => {
            if (resp.data.data.length > 0) {
              this.studentPaymentsPerAcademyPerSport = resp.data.data;
              this.studentPaymentsPerAcademyPerSportTotals = {
                paid: 0,
                pending: 0,
                totalAmount: 0,
                feeDiscount: 0
              };
              this.studentPaymentsPerAcademyPerSport.map(item => {
                this.studentPaymentsPerAcademyPerSportTotals.academyName =
                  "Total";
                this.studentPaymentsPerAcademyPerSportTotals.sportName = "";
                this.studentPaymentsPerAcademyPerSportTotals.slNo = "";
                this.studentPaymentsPerAcademyPerSportTotals.paid += item.paid;
                this.studentPaymentsPerAcademyPerSportTotals.pending +=
                  item.pending;
                this.studentPaymentsPerAcademyPerSportTotals.totalAmount +=
                  item.totalAmount;
                this.studentPaymentsPerAcademyPerSportTotals.feeDiscount += +item.feeDiscount;
                item.paid = "₹" + item.paid;
                item.pending = "₹" + item.pending;
                item.totalAmount = "₹" + item.totalAmount;
                item.feeDiscount = "₹" + item.feeDiscount;
              });
              this.studentPaymentsPerAcademyPerSportTotals.paid = "₹" + this.studentPaymentsPerAcademyPerSportTotals.paid;
              this.studentPaymentsPerAcademyPerSportTotals.pending = "₹" + this.studentPaymentsPerAcademyPerSportTotals.pending;
              this.studentPaymentsPerAcademyPerSportTotals.totalAmount = "₹" + this.studentPaymentsPerAcademyPerSportTotals.totalAmount;
              this.studentPaymentsPerAcademyPerSportTotals.feeDiscount = "₹" + this.studentPaymentsPerAcademyPerSportTotals.feeDiscount;
              this.studentPaymentsPerAcademyPerSport.push(
                this.studentPaymentsPerAcademyPerSportTotals
              );
              callback({
                recordsTotal: resp.data.recordsTotal,
                recordsFiltered: resp.data.recordsFiltered,
                data: this.studentPaymentsPerAcademyPerSport
              });
            } else {
              callback({
                recordsTotal: 0,
                recordsFiltered: 0,
                data: []
              });
            }
          });
      },
      columns: [
        { title: "S.No", data: "slNo", orderable: false },
        { title: "Academy", data: "academyName" },
        { title: "Sport", data: "sportName" },
        { title: "Paid", data: "paid", className: "dt-body-right" },
        { title: "Pending", data: "pending", className: "dt-body-right" },
        { title: "Discount", data: "feeDiscount", className: "dt-body-right" },
        { title: "Total", data: "totalAmount", className: "dt-body-right" }
      ],
      dom: "Blfrtip"
    };
  }

  clearDate() {
    this.reportByAcademy.endDate = "";
  }
  feeSummaryFilters: any = {};
  getReportData() {
    if (
      this.academyFilterOfFeeSummaryReport !== "ALL" &&
      !this.userDetails.type
    ) {
      this.feeSummaryFilters.academy = this.academyFilterOfFeeSummaryReport;
    } else {
      this.feeSummaryFilters = {};
    }
    this.dtElements.map((item, i) => {
      item.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this[`dtTrigger${i + 1}`].next();
      });
    });
  }

  academiesList: any = [];
  academyFilterOfFeeSummaryReport: any = "";
  getAcademiesList() {
    this.dashBoardService.getAcademiesList().subscribe(
      (data: any) => {
        this.academiesList = data.data.data;
      },
      error => {}
    );
  }
}

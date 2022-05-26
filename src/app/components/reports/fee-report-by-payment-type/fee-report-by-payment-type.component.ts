import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DashBoardService } from '../../../services/dash_board/dash-board.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CookieService } from 'angular2-cookie/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AppSettings } from '../../../apiUrls';
import { AppDateAdapter, APP_DATE_FORMATS } from './../../../Utilities/date.datepicker';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatToolbarModule, MatTooltipModule } from "@angular/material";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-fee-report-by-payment-type',
  templateUrl: './fee-report-by-payment-type.component.html',
  styleUrls: ['./fee-report-by-payment-type.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class FeeReportByPaymentTypeComponent implements OnInit {

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtTrigger1: Subject<any> = new Subject();
  dtOptions = {};
  parentAcademyLogin = false;
  userDetails: any = {};
  currentLoginData: any = {};
  superAdminFeeReportByPaymentMethod: any = [];
  superAdminFeeReportByPaymentMethodTotals: any = {};
  reportByPaymentType: any = {};

  constructor(
    private dashBoardService: DashBoardService,
    private cookieService: CookieService,
    private httpClient: HttpClient,
  ) { }

  ngOnInit() {
    this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      this.currentLoginData = { academy: this.userDetails.id };
    }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy') {
      this.currentLoginData = { parentAcademy: this.userDetails.id };
      this.parentAcademyLogin = true;
    } else {
      this.getAcademiesList();
    }
    var date = new Date();
    this.reportByPaymentType.startDate = new Date(date.getFullYear(), 0);
    this.reportByPaymentType.endDate = new Date();
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
      pagingType: 'full_numbers',
      pageLength: 25,
      lengthMenu: [[-1, 5, 10, 25, 50, 100], ["ALL", 5, 10, 25, 50, 100]],
      serverSide: true,
      //scrollY: "500px",
      processing: true,
      destroy: true,
      retrieve: true,
      buttons: [
        // 'colvis',
        {
          extend: 'print',
          text: 'Print',
          title: 'Fee report by Payment Type'
        },
        {
          extend: 'excel',
          text: 'Excel',
          title: 'Fee report by Payment Type'
        },
        {
          extend: 'pdf',
          text: 'Pdf',
          title: 'Fee report by Payment Type'
        }
      ],
      ajax: (dataTablesParameters: any, callback) => {
        this.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT + 'studentPayments/superAdminFeeReportByPaymentMethod',
            Object.assign(dataTablesParameters, this.reportByPaymentType, this.currentLoginData, this.paymentSummaryFilters), {}
          ).subscribe((resp: any) => {
            if (resp.data.data.length > 0) {
              this.superAdminFeeReportByPaymentMethod = resp.data.data;
              this.superAdminFeeReportByPaymentMethodTotals = {
                paidInOnline: 0,
                paidInOffline: 0,
                totalAmount: 0,
                feeDiscount:0
              }
              this.superAdminFeeReportByPaymentMethod.map((item) => {
                this.superAdminFeeReportByPaymentMethodTotals.paidInOnline += item.paidInOnline;
                this.superAdminFeeReportByPaymentMethodTotals.paidInOffline += item.paidInOffline;
                this.superAdminFeeReportByPaymentMethodTotals.totalAmount += item.totalAmount;
                this.superAdminFeeReportByPaymentMethodTotals.feeDiscount += +item.feeDiscount;
                this.superAdminFeeReportByPaymentMethodTotals.slNo = "";
                this.superAdminFeeReportByPaymentMethodTotals.academyName = "Total";
                this.superAdminFeeReportByPaymentMethodTotals.sportName = "";
                item.paidInOnline = "₹" + item.paidInOnline;
                item.paidInOffline = "₹" + item.paidInOffline;
                item.totalAmount = "₹" + item.totalAmount;
                item.feeDiscount = "₹" + item.feeDiscount;
              });
              this.superAdminFeeReportByPaymentMethodTotals.paidInOnline = "₹" + this.superAdminFeeReportByPaymentMethodTotals.paidInOnline;
              this.superAdminFeeReportByPaymentMethodTotals.paidInOffline = "₹" + this.superAdminFeeReportByPaymentMethodTotals.paidInOffline;
              this.superAdminFeeReportByPaymentMethodTotals.totalAmount = "₹" + this.superAdminFeeReportByPaymentMethodTotals.totalAmount;
              this.superAdminFeeReportByPaymentMethodTotals.feeDiscount = "₹" + this.superAdminFeeReportByPaymentMethodTotals.feeDiscount;
              this.superAdminFeeReportByPaymentMethod.push(this.superAdminFeeReportByPaymentMethodTotals);
              callback({
                recordsTotal: resp.data.recordsTotal,
                recordsFiltered: resp.data.recordsFiltered,
                data: this.superAdminFeeReportByPaymentMethod
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
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Academy', data: 'academyName' },
        { title: 'Sport', data: 'sportName' },
        { title: 'Online Payments', data: 'paidInOnline', className: 'dt-body-right' },
        { title: 'Offline Payments', data: 'paidInOffline', className: 'dt-body-right' },
        { title: 'Discount', data: 'feeDiscount', className: 'dt-body-right' },
        { title: 'Total', data: 'totalAmount', className: 'dt-body-right' }
      ],
      dom: 'Blfrtip'
    };
  }

  clearDate() {
    this.reportByPaymentType.endDate = '';
  }

  paymentSummaryFilters: any = {}
  getReportData() {
    if (this.academyFilterOfPaymentSummaryReport !== "ALL" && !this.userDetails.type) {
      this.paymentSummaryFilters.academy = this.academyFilterOfPaymentSummaryReport;
    } else {
      this.paymentSummaryFilters = {};
    }
    this.dtElements.map((item, i) => {
      item.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this[`dtTrigger${i + 1}`].next();
      });
    });
  }

  academiesList: any = [];
  academyFilterOfPaymentSummaryReport: any = '';
  getAcademiesList() {
    this.dashBoardService.getAcademiesList().subscribe((data: any) => {
      this.academiesList = data.data.data;
    }, error => {
    });
  }

}

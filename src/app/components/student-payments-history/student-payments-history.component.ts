import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Routes, ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MasterDataService } from '../../services/master_data/master-data.service';
import { AppDateAdapter, APP_DATE_FORMATS } from './../../Utilities/date.datepicker';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatToolbarModule, MatTooltipModule } from "@angular/material";
import { CookieService } from 'angular2-cookie/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AppSettings } from '../../apiUrls';


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-student-payments-history',
  templateUrl: './student-payments-history.component.html',
  styleUrls: ['./student-payments-history.component.css']
})
export class StudentPaymentsHistoryComponent implements OnInit {


  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  academiesList: any = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  userDetails: any = {};
  academyData: any = {};

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private masterDataService: MasterDataService,
    private cookieService: CookieService,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient
  ) { }
  studentPaymentsHistory: any = [];
  ngOnInit() {
    this.userDetails = this.cookieService.getObject('currentStudentData');
    this.getStudentPaymentHistory();
  }
  studentsPaymentHistory: any = [];
  getStudentPaymentHistory() {
    this.userDetails.requestFrom = "WEB";
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      retrieve: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT + 'studentPayments/getTransactionsOfStudent',
            Object.assign(dataTablesParameters, this.userDetails), {}
          ).subscribe((resp: any) => {
            this.studentsPaymentHistory = resp.data.payments;
            if (resp.data.payments.length > 0) {
              callback({
                recordsTotal: resp.data.recordsTotal,
                recordsFiltered: resp.data.recordsFiltered,
                data: []
              });
            }else{
              callback({
                recordsTotal: resp.data.recordsTotal,
                recordsFiltered: resp.data.recordsFiltered,
                data: []
              });
            }
          });
      },
      columns: [
        { title: 'Month of payment', data: 'paymentMonthName' },
        { title: 'Amount', data: 'amount' },
        { title: 'Discount', data: 'discountAmount' },
        { title: 'Recieved amount', data: 'amountAfterDiscount' },
        { title: 'Payment status', data: 'paymentStatus' },
        { title: 'Mode of payment', data: 'modeOfPayment' }
      ]
    };
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.cookieService.remove('currentStudentData');
  }

}

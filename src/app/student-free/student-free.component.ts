import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Routes, ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MasterDataService } from '../services/master_data/master-data.service';
import { AppDateAdapter, APP_DATE_FORMATS } from './../Utilities/date.datepicker';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatToolbarModule, MatTooltipModule } from "@angular/material";
import { CookieService } from 'angular2-cookie/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AppSettings } from '../apiUrls';
import { StudentService } from './../services/student/student.service';
import { AcademyService } from './../services/academy/academy.service';
import { CoachService } from './../services/coach/coach.service';
declare var $;

class academyData {
  slNo: number;
  name: string;
  sportName: string;
  levelName: string;
  totalDue: number;
  paidAmount: number;
  lastPaidDate: string;
  unPaidAmount: number;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-student-free',
  templateUrl: './student-free.component.html',
  styleUrls: ['./student-free.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class StudentFreeComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private masterDataService: MasterDataService,
    private cookieService: CookieService,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private studentService: StudentService,
    private academyService: AcademyService,
    private coachService: CoachService,
  ) { }

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;

  academiesList: any = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  userDetails: any = {};
  academyData: any = {};
  filters = {batch: "", sport: "", filterMonth: "", filterYear: ""};
  ngOnInit() {
    this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      this.academyData.academy = this.userDetails.id;
      this.getAcademyStudentsPaymentsData();
    } else {
      this.getAcademiesList();
    }
    this.onActivate(event);

    this.getAcademySports(this.userDetails.id);
    this.getBatches({academy: this.userDetails.id});
    this.years = this.getYears();
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

  currentDate = new Date();

  studentsPayments: any = [];
  getAcademyStudentsPaymentsData() {
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
            AppSettings.API_ENDPOINT + 'studentPayments/getAcademyStudentsFeePayments',
            Object.assign(dataTablesParameters, this.academyData, this.filters), {}
          ).subscribe((resp: any) => {
            this.studentsPayments = resp.data.data;
            if (resp.data.data.length > 0) {
              var totals = {
                slNo: '',
                studentName: 'Total',
                sportName: '',
                levelName: '',
                totalDue: 0,
                amountPaid: 0,
                lastPaidDate: '',
                amountToPay: 0,
                totalDiscount: 0
              };
              this.studentsPayments.map((item)=>{
                totals.totalDue += item.totalDue;
                totals.amountPaid += item.amountPaid;
                totals.amountToPay += item.amountToPay;
                totals.totalDiscount += item.totalDiscount;
              });
              this.studentsPayments.push(totals);
              callback({
                recordsTotal: resp.data.recordsTotal,
                recordsFiltered: resp.data.recordsFiltered,
                data: []
              });
            } else {
              callback({
                recordsTotal: resp.data.recordsTotal,
                recordsFiltered: resp.data.recordsFiltered,
                data: []
              });
            }
          });
      },
      columns: [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Student name', data: 'studentName' },
        { title: 'Sport', data: 'sportName' },
        { title: 'Level', data: 'levelName' },
        { title: 'Total amount', data: 'totalDue', orderable: false },
        { title: 'Total discount', data: 'totalDiscount', orderable: false },
        { title: 'Amount recieved', data: 'amountPaid', orderable: false },
        { title: 'Last paid on', data: 'lastPaidDate', orderable: false },
        { title: 'Balance due', data: 'amountToPay', orderable: false },
        { title: 'Payment status', data: '', orderable: false }
      ],
      // scrollY: "400px",
      // scrollX: false
    };
  }
  getStudentPaymentHistory(student) {
    var studentData = {
      "academy": student.academy,
      "studentId": student.studentId,
      "transactionDate": new Date(),
      "batchTimingId": student.batchTimingId,
      "transactionType": "PAID",
      "name": student.studentName,
      "sport": student.sportName,
      "level": student.levelName
    }
    this.cookieService.putObject('currentStudentData', studentData);
    this.router.navigate(['/Sidemenu/studentfree/studentPaymentHistory']);
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  feePayment: any = {};
  removePayment() {
    this.feePayment = {};
  }
  openPayment(payment) {
    this.feePayment = payment;
  }

  getAcademiesList() {
    this.masterDataService.getAcademiesList().subscribe((data: any) => {
      this.academiesList = data.data;
      if (this.academiesList.length > 0) {
        this.academyData.academy = this.academiesList[0]._id;
        this.getAcademyStudentsPaymentsData();
      }
    }, (err) => {

    })
  }

  payBalanceDue() {
    if (!this.feePayment.modeOfPayment) {
      this.toastr.error('Please select mode of payment');
      return;
    }
    if (!this.feePayment.dateOfPayment) {
      this.toastr.error('Please select date of payment');
      return;
    }
    var sendObj = {
      "student": this.feePayment.studentId,
      "academy": this.feePayment.academy,
      "sport": this.feePayment.sportId,
      "batch": this.feePayment.batchId,
      "modeOfPayment": this.feePayment.modeOfPayment,
      "dop": new Date(this.feePayment.dateOfPayment).getTime(),
      "amount": this.feePayment.amountToPay,
      "studentBatchName": this.feePayment.levelName
    }
    this.studentService.updateStudentsPaymentsStatus(sendObj).subscribe((data) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
        this.feePayment = {};
        this.closeAddExpenseModal.nativeElement.click();
      });
      this.toastr.success(' Payment completed successfully');
    }, (err) => {

    })
  }


  allSports: any = [];
  getAllSports(){
    this.academyService.getAllSports().subscribe((data: any) => {
      if(data.status == "success"){
        this.allSports = data.data;
      }else{
        this.allSports = [];
      }
    }, error => {
      this.allSports = [];
    });
  }

  getAcademySports(id){
    this.academyService.getAcademySports(id).subscribe((data: any) => {
      if(data.status == "success"){
        this.allSports = data.data;
      }else{
        this.allSports = [];
      }
    }, error => {
      this.allSports = [];
    });
  }

  batchesList: any = [];
  getBatches(data){
    this.academyService.getBatchesListByAcademyOrParentAcademyOrAll(data).subscribe((data: any)=>{
      this.batchesList = data.data;
    })
  }

  monthsArr = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 }
  ]

  years: any = [];
  getYears = function () {
    var currentYear = new Date().getFullYear();
    var years = [];
    for (var i = 2000; i <= currentYear; i++) {
      years.push(i);
    }
    return years;
  }

  getStudentsByFilters(){
    if(this.filters.filterMonth && !this.filters.filterYear){
      this.toastr.error("Please select filterYear.");
      return;
    }
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

}

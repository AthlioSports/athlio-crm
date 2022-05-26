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
  selector: 'app-students-report',
  templateUrl: './students-report.component.html',
  styleUrls: ['./students-report.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class StudentsReportComponent implements OnInit {

  constructor(
    private dashBoardService: DashBoardService,
    private cookieService: CookieService,
    private httpClient: HttpClient,
  ) { }

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtTrigger1: Subject<any> = new Subject();
  reportByAcademy: any = {};
  studentsReport: any = [];
  dtOptions = {};
  userDetails: any = {};
  currentLoginData: any = {};

  parentAcademyLogin = false;
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
      pagingType: 'full_numbers',
      pageLength: 25,
      lengthMenu: [[-1, 5, 10, 25, 50, 100], ["ALL", 5, 10, 25, 50, 100]],
      serverSide: true,
      //scrollY: "500px",
      adjust: true,
      //scrollX: true,
      processing: true,
      retrieve: true,
      title: 'Datatables example: Customisation of the print view window',
      buttons: [
        // 'colvis',
        {
          extend: 'print',
          text: 'Print',
          title: 'Students Report'
        },
        {
          extend: 'excel',
          text: 'Excel',
          title: 'Students Report'
        },
        {
          extend: 'pdf',
          text: 'Pdf',
          title: 'Students Report',
          orientation: 'landscape',
          pageSize: 'LEGAL'
        }
      ],
      ajax: (dataTablesParameters: any, callback) => {
        this.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT + 'students/studentsReport',
            Object.assign(dataTablesParameters, this.reportByAcademy, this.currentLoginData, this.studentsReportFilters), {}
          ).subscribe((resp: any) => {
            if (resp.data.data.length > 0) {
              this.studentsReport = resp.data.data;
              callback({
                recordsTotal: resp.data.recordsTotal,
                recordsFiltered: resp.data.recordsFiltered,
                data: this.studentsReport
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
        { title: 'Name', data: 'studentName', width: "200px" },
        { title: 'Email', data: 'studentEmail' },
        { title: 'Mobile', data: 'studentPhone' },
        { title: 'Academy', data: 'academyName', width: "200px" },
        { title: 'Coach', data: 'coachName' },
        { title: 'Batch', data: 'batchName' },
        { title: 'Sport', data: 'sportName' },
        { title: 'Gender', data: 'studentGender' },
        { title: 'Status', data: 'studentStatus' }
      ],
      dom: 'Blfrtip'
    };
  }

  clearDate() {
    this.reportByAcademy.endDate = '';
  }
  studentsReportFilters: any = {};
  getReportData() {
    if (this.academyFilterOfStudentReport !== "ALL" && !this.userDetails.type) {
      this.studentsReportFilters.academy = this.academyFilterOfStudentReport;
    } else {
      this.studentsReportFilters = {};
    }
    this.dtElements.map((item, i) => {
      item.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this[`dtTrigger${i + 1}`].next();
      });
    });
  }

  academiesList: any = [];
  academyFilterOfStudentReport: any = '';
  getAcademiesList() {
    this.dashBoardService.getAcademiesList().subscribe((data: any) => {
      this.academiesList = data.data.data;
    }, error => {
    });
  }

}

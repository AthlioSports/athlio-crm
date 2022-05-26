import { Component, OnInit, NgModule, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DashBoardService } from '../../services/dash_board/dash-board.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CookieService } from 'angular2-cookie/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AppSettings } from '../../apiUrls';
import { AppDateAdapter, APP_DATE_FORMATS } from './../../Utilities/date.datepicker';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatToolbarModule, MatTooltipModule } from "@angular/material";


class studentData {
  slNo: number;
  academyName: string;
  sportName: string;
  batchName: string;
  count: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})









export class DashboardComponent implements OnInit {

  constructor(
    private dashBoardService: DashBoardService,
    private cookieService: CookieService,
    private httpClient: HttpClient,
  ) { }
  // single: any[];

  // @ViewChild(DataTableDirective)
  // dtElement1: DataTableDirective;


  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;

  dtOptions = {};
  dtTrigger1: Subject<any> = new Subject();
  dtStudentsList: studentData[];
  results: any[];

  view: any[] = [400, 300];
  reportByAcademy: any = {};
  reportByPaymentType: any = {};

  // options
  showXAxis = false;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Sports';
  showYAxisLabel = true;
  yScaleMax = 100;
  barPadding = 10;
  yAxisLabel = 'Total Students';
  userDetails: any = {};
  academyLogin: any = false;
  colorScheme = {
    domain: ['#072E61', '#F26D7D', '#B666CB']
  };
  graph2Options = {
    view: [550, 335],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: 'Months',
    showYAxisLabel: true,
    yScaleMax: 100,
    barPadding: 10,
    yAxisLabel: 'Total Revenue',
    colorScheme: {
      domain: ["#25B297", "#EBF43E", "#C03A26", "#D56D54", '#072E61', '#F26D7D', '#B666CB', '#05BED7']
    }
  }
  graph3Options = {
    view: [550, 335],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: 'Months',
    showYAxisLabel: true,
    yScaleMax: 100,
    barPadding: 10,
    yAxisLabel: 'Total Students',
    colorScheme: {
      domain: ["#25B297", "#EBF43E", "#C03A26", "#D56D54", '#072E61', '#F26D7D', '#B666CB', '#05BED7']
    }
  }
  doughNutChartColors = [
    {
      backgroundColor: ["#f38b4a", "#56d798", "#ff8397", "#6970d5"]
    }
  ]
  doughNutChartOptions = {
    legend: { position: 'bottom' },
    aspectRatio: 1.1
  }
  seriesGraphOptions = {
    view: [550, 335],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: 'Months',
    showYAxisLabel: true,
    yScaleMax: 100,
    barPadding: 10,
    yAxisLabel: 'Total revenue',
    colorScheme: {
      domain: ['#aeceef', '#68c3ae', '#2c3575']
    }
  }
  pieChartOptions = {
    view: [],
    gradient: false,
    showLegend: true,
    colorScheme: {
      domain: ["#C03A26", "#D56D54", "#25B297", "#EBF43E", '#072E61', '#F26D7D', '#B666CB', '#05BED7']
    }
  }
  onResize1(event) {
    this.view = [event.target.innerWidth / 6, 150];
  }

  onResize2(event) {
    this.graph2Options.view = [event.target.innerWidth / 2.75, 360];
  }
  onResize3(event) {
    this.pieChartOptions.view = [event.target.innerWidth / 1.75, 300];
  }
  masterDataCounts: any = {};
  currentYear = new Date().getFullYear();
  graph2Results: any = [];
  pieChartGraphData: any = [];
  years: any = [];
  selectedYear: any;
  selectedYear2: any;
  currentLoginData: any = {};
  studentsSportFilters: any = {};
  seriesGraphResults: any = [
    {
      "name": "January",
      "series": [
        {
          "name": "Cricket",
          "value": 40632
        },
        {
          "name": "Football",
          "value": 36953
        },
        {
          "name": "Tennis",
          "value": 31476
        }
      ]
    },
    {
      "name": "Feb",
      "series": [
        {
          "name": "Cricket",
          "value": 49737
        },
        {
          "name": "Football",
          "value": 45986
        },
        {
          "name": "Tennis",
          "value": 37060
        }
      ]
    },
    {
      "name": "March",
      "series": [
        {
          "name": "Cricket",
          "value": 36745
        },
        {
          "name": "Football",
          "value": 34774
        },
        {
          "name": "Tennis",
          "value": 29476
        }
      ]
    },
    {
      "name": "Apr",
      "series": [
        {
          "name": "Cricket",
          "value": 36240
        },
        {
          "name": "Football",
          "value": 32543
        },
        {
          "name": "Tennis",
          "value": 26424
        }
      ]
    }
  ]
  getYears = function () {
    var currentYear = new Date().getFullYear();
    var years = [];
    for (var i = 2000; i <= currentYear; i++) {
      years.push(i);
    }
    return years;
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
  filterMonth: any = new Date().getMonth() + 1;
  revenuePerSportFilterMonth:any = new Date().getMonth() + 1;
  filterYear: any = new Date().getFullYear();
  ageGroupFilterYear: any = new Date().getFullYear();
  ageGroupFilterMonth: any = new Date().getMonth() + 1;
  studentsPerSportByGenderFilterYear: any = new Date().getFullYear();
  studentsPerSportByGenderFilterMonth: any = new Date().getMonth() + 1;
  doughNutChartFilterMonth: any = new Date().getMonth() + 1;
  doughNutChartFilterYear: any = new Date().getFullYear();
  graphByGenderData: any = [];
  graphByGenderyScaleMax: any;
  doughnutChartData: any = [];
  doughnutChartLabels: any = [];
  parentacademy = false;
  userDetailsMasterData: any = {};
  ageGroupData: any = [];
  ngOnInit() {
    let data: any = {};
    this.years = this.getYears();
    data.filterMonth = this.filterMonth;
    data.filterYear = this.filterYear;
    data.year = this.currentYear;
    this.selectedYear = this.currentYear;
    this.selectedYear2 = this.currentYear;
    this.userDetails = this.cookieService.getObject('loginResponce');
    this.userDetailsMasterData = this.cookieService.getObject('loginResponce');
    var serviceName = "";
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      data = { academy: this.userDetails.id, year: this.currentYear, filterMonth: this.filterMonth, filterYear: this.filterYear };
      this.currentLoginData = { academy: this.userDetails.id };
      this.academyLogin = true;
      serviceName = "getCounts"
    }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy') {
      data = { parentAcademy: this.userDetails.id, year: this.currentYear, filterMonth: this.filterMonth, filterYear: this.filterYear };
      this.currentLoginData = { parentAcademy: this.userDetails.id };
      this.parentacademy = true;
      this.branchAcademy = this.userDetails.id;
      serviceName = "getParentAcademyDashBoardCounts"
      this.getBranchAcademies();
    } else {
      this.getAcademiesList();
      serviceName = "getCounts"
    }
    this.dashBoardService[serviceName](data).subscribe((data: any) => {
      this.masterDataCounts = data.data;
    }, error => {
    });
    this.dashBoardService.getStudentsPerBatchPerSport(data).subscribe((data: any) => {
      this.results = data.data.studentsList;
      this.yScaleMax = data.data.maxCount + 5;
    }, error => {
    });
    this.dashBoardService.getStudentsDataByAgeGroup(data).subscribe((data: any) => {
      this.ageGroupData = data.data;
    }, error => {
    });
    this.dashBoardService.getStudentsPerSportByGender(data).subscribe((data: any) => {
      this.graphByGenderData = data.data.data;
      var counts = [];
      if (this.graphByGenderData.length > 0) {
        this.graphByGenderData.map((item) => {
          if (item.series.length > 0) {
            var count = 0;
            item.series.map((batch) => {
              count += batch.value;
            });
            counts.push(count);
          }
        })
      }
      this.graphByGenderyScaleMax = Math.max(...counts) + 5;
      //this.graphByGenderyScaleMax = data.data.maxCount + 5;
    }, error => {
    });
    this.dashBoardService.getRevenuePerSport(data).subscribe((data: any) => {
      this.graph2Results = data.data;
      var counts = [];
      // if (this.graph2Results.length > 0) {
      //   this.graph2Results.map((item) => {
      //     if (item.series.length > 0) {
      //       var count = 0;
      //       item.series.map((batch) => {
      //         count += batch.value;
      //       });
      //       counts.push(count);
      //     }
      //   })
      // }
      // this.graph2Options.yScaleMax = Math.max(...counts) + 5;
    }, error => {
    });
    this.dashBoardService.getPieChartData(data).subscribe((data: any) => {
      this.doughnutChartData = data.data.data;
      this.doughnutChartLabels = data.data.lables
    }, error => {
    });
    var date = new Date();
    this.reportByAcademy.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.reportByAcademy.endDate = new Date();
    this.reportByPaymentType.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.reportByPaymentType.endDate = new Date();
    const that = this;
    this.dtOptions[0] = this.getDtOptions1();
    this.view = [innerWidth / 6, 150];
    this.graph2Options.view = [innerWidth / 2.75, 360];
    this.pieChartOptions.view = [innerWidth / 2.6, 300];
    this.onActivate(event);
    this.getStudentsPerMonthByYear()
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

  getDtOptions1() {
    return {
      pagingType: 'full_numbers',
      pageLength: 25,
      lengthMenu: [[-1, 5, 10, 25, 50, 100], ["ALL", 5, 10, 25, 50, 100]],
      scrollY: "370px",
      serverSide: true,
      processing: true,
      retrieve: true,
      destroy: true,
      language: { search: "" },
      buttons: [
        {
          extend: 'print',
          text: 'Print',
          title: 'students Report'
        },
        {
          extend: 'excel',
          text: 'Excel',
          title: 'students Report'
        },
        {
          extend: 'pdf',
          text: 'Pdf',
          title: 'students Report'
        }
      ],
      ajax: (dataTablesParameters: any, callback) => {
        this.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT + 'students/getStudentReportForSA',
            Object.assign(dataTablesParameters, this.currentLoginData, this.studentsSportFilters), {}
          ).subscribe((resp: any) => {
            this.dtStudentsList = resp.data.data;
            callback({
              recordsTotal: resp.data.recordsTotal,
              recordsFiltered: resp.data.recordsFiltered,
              data: resp.data.data
            });
          });
      },
      columns: [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Academy', data: 'academyName' },
        { title: 'Sport', data: 'sportName' },
        { title: 'Level', data: 'batchName' },
        { title: 'Count', data: 'count' }
      ],
      dom: 'Blfrtip'
    };
  }
  academiesList: any = [];
  academyFilterOfStudentsReport: any = '';
  getAcademiesList() {
    this.dashBoardService.getAcademiesList().subscribe((data: any) => {
      this.academiesList = data.data.data;
    }, error => {
    });
  }

  getStudentsReport() {
    if (this.academyFilterOfStudentsReport !== "ALL" && !this.userDetails.type) {
      this.studentsSportFilters.academy = this.academyFilterOfStudentsReport;
    }else{
      this.studentsSportFilters = {};
    }
    setTimeout(() => {
      this.dtElements.map((item, i) => {
        item.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this[`dtTrigger${i + 1}`].next();
        });
      });
    });
  }

  getStudentsPerBatchPerSport() {
    var postData: any = {
      filterMonth: parseInt(this.filterMonth),
      filterYear: parseInt(this.filterYear)
    }
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      postData.academy = this.userDetails.id
    }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy' && this.userDetailsMasterData.id === this.branchAcademy) {
      postData.parentAcademy = this.userDetails.id ;
    }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy' && this.userDetailsMasterData.id !== this.branchAcademy) {
      postData.academy = this.userDetails.id ;
    }
    // else{
    //   postData.academy = this.userDetails.id
    // }
    this.dashBoardService.getStudentsPerBatchPerSport(postData).subscribe((data: any) => {
      this.results = data.data.studentsList;
      this.yScaleMax = data.data.maxCount + 5;
    }, error => {
    });
  }

  getStudentsDataByAgeGroup() {
    var postData: any = {
      filterMonth: parseInt(this.ageGroupFilterMonth),
      filterYear: parseInt(this.ageGroupFilterYear)
    }
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      postData.academy = this.userDetails.id
    }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy' && this.userDetailsMasterData.id === this.branchAcademy) {
      postData.parentAcademy = this.userDetails.id ;
    }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy' && this.userDetailsMasterData.id !== this.branchAcademy) {
      postData.academy = this.userDetails.id ;
    }
    // else{
    //   postData.academy = this.userDetails.id
    // }
    this.dashBoardService.getStudentsDataByAgeGroup(postData).subscribe((data: any) => {
      this.ageGroupData = data.data;
    }, error => {
    });
  }
  getStudentsPerSportByGender() {
    var postData: any = {
      filterMonth: parseInt(this.studentsPerSportByGenderFilterMonth),
      filterYear: parseInt(this.studentsPerSportByGenderFilterYear)
    }
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      postData.academy = this.userDetails.id
    }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy' && this.userDetailsMasterData.id === this.branchAcademy) {
      postData.parentAcademy = this.userDetails.id ;
    }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy' && this.userDetailsMasterData.id !== this.branchAcademy) {
      postData.academy = this.userDetails.id ;
    }
    // else{
    //   postData.academy = this.userDetails.id
    // }
    this.dashBoardService.getStudentsPerSportByGender(postData).subscribe((data: any) => {
      this.graphByGenderData = data.data.data;
      var counts = [];
      if (this.graphByGenderData.length > 0) {
        this.graphByGenderData.map((item) => {
          if (item.series.length > 0) {
            var count = 0;
            item.series.map((batch) => {
              count += batch.value;
            });
            counts.push(count);
          }
        })
      }
      this.graphByGenderyScaleMax = Math.max(...counts) + 5;
    }, error => {
    });
  }
  parentBranchAcademies = [];
  getBranchAcademies() {
    this.dashBoardService.getBranchAcademies({parentAcademy : this.userDetails.id}).subscribe((data: any) => {
      this.parentBranchAcademies = data.data.data;
    }, error => {
    });
  }
  branchAcademy: any;
  getBranchAcademiesData(){
    this.userDetails.id = this.branchAcademy;
    this.getStudentsPerBatchPerSport();
    this.getRevenuePerSport();
    this.getDoughNutChartData();
    this.getStudentsPerSportByGender();
    this.getStudentsPerMonthByYear();
    this.getStudentsDataByAgeGroup();
    this.getDashboardCounts();
  }

  getDashboardCounts(){
    var serviceName = '';
    var data = {};
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy' && this.userDetailsMasterData.id === this.branchAcademy) {
      serviceName = "getParentAcademyDashBoardCounts";
      data = { parentAcademy: this.userDetails.id, year: this.currentYear, filterMonth: this.filterMonth, filterYear: this.filterYear };
    }
    else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy' && this.userDetailsMasterData.id !== this.branchAcademy) {
      data = { academy: this.userDetails.id, year: this.currentYear, filterMonth: this.filterMonth, filterYear: this.filterYear };
      serviceName = "getCounts"
    }
    this.dashBoardService[serviceName](data).subscribe((data: any) => {
      this.masterDataCounts = data.data;
    }, error => {
    });
  }

  getDoughNutChartData() {
    var postData: any = {
      filterMonth: parseInt(this.doughNutChartFilterMonth),
      filterYear: parseInt(this.doughNutChartFilterYear)
    }
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      postData.academy = this.userDetails.id
    }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy' && this.userDetailsMasterData.id === this.branchAcademy) {
      postData.parentAcademy = this.userDetails.id ;
    }
    else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy' && this.userDetailsMasterData.id !== this.branchAcademy) {
      postData.academy = this.userDetails.id ;
    }
    // else{
    //   postData.academy = this.userDetails.id
    // }
    this.dashBoardService.getPieChartData(postData).subscribe((data: any) => {
      this.doughnutChartData = data.data.data;
      this.doughnutChartLabels = data.data.lables
    }, error => {
    });
  }
  ngAfterViewInit(): void {
    this.dtTrigger1.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger1.unsubscribe();
  }
  getRevenuePerSport() {
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy' && this.userDetailsMasterData.id === this.branchAcademy) {
      this.currentLoginData = {
        parentAcademy : this.userDetails.id,
        filterYear : parseInt(this.selectedYear),
        filterMonth: parseInt(this.revenuePerSportFilterMonth)
      };
    }else if(this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin'){
      this.currentLoginData = {
        academy : this.userDetails.id,
        filterYear : parseInt(this.selectedYear),
        filterMonth: parseInt(this.revenuePerSportFilterMonth)
      };
    }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy' && this.userDetailsMasterData.id !== this.branchAcademy) {
      this.currentLoginData = {
        academy : this.userDetails.id,
        filterYear : parseInt(this.selectedYear),
        filterMonth: parseInt(this.revenuePerSportFilterMonth)
      };
    }else {
      this.currentLoginData = {
        filterYear : parseInt(this.selectedYear),
        filterMonth: parseInt(this.revenuePerSportFilterMonth)
      };
    }
    this.dashBoardService.getRevenuePerSport(this.currentLoginData).subscribe((data: any) => {
      this.graph2Results = data.data;
      var counts = [];
      // if (this.graph2Results.length > 0) {
      //   this.graph2Results.map((item) => {
      //     if (item.series.length > 0) {
      //       var count = 0;
      //       item.series.map((batch) => {
      //         count += batch.value;
      //       });
      //       counts.push(count);
      //     }
      //   })
      // }
      // this.graph2Options.yScaleMax = Math.max(...counts) + 5;
    }, error => {
    });
  }

  graph3Results: any = [];
  grap3YScaleMax: any;
  getStudentsPerMonthByYear() {
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy' && this.userDetailsMasterData.id === this.branchAcademy) {
      this.currentLoginData = {
        parentAcademy : this.userDetails.id,
        year : parseInt(this.selectedYear2)
      };
    }else if(this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin'){
      this.currentLoginData = {
        academy : this.userDetails.id,
        year : parseInt(this.selectedYear2)
      };
    }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy' && this.userDetailsMasterData.id !== this.branchAcademy) {
      this.currentLoginData = {
        academy : this.userDetails.id,
        year : parseInt(this.selectedYear)
      };
    }else {
      this.currentLoginData = {
        year : parseInt(this.selectedYear2)
      };
    }
    this.dashBoardService.getStudentsPerMonthByYear(this.currentLoginData).subscribe((data: any) => {
      this.graph3Results = data.data.data;
      this.grap3YScaleMax = data.data.max + 5;
    }, error => {
    });
  }

  getStudentsperSportPerBatchData() {
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
            AppSettings.API_ENDPOINT + 'students/getStudentReportForSA',
            Object.assign(dataTablesParameters, this.currentLoginData), {}
          ).subscribe((resp: any) => {
            this.dtStudentsList = resp.data.data;
            callback({
              recordsTotal: resp.data.recordsTotal,
              recordsFiltered: resp.data.recordsFiltered,
              data: []
            });
          });
      },
      columns: [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Academy', data: 'academyName' },
        { title: 'Sport', data: 'sportName' },
        { title: 'Level', data: 'batchName' },
        { title: 'Count', data: 'count' },
        { title: 'Action', data: '', orderable: false }
      ]
    };
  }
  getReportData(type: number) {
      this.dtElements.map((item, i) => {
        item.dtInstance.then((dtInstance: DataTables.Api) => {
          if (type == i) {
            dtInstance.destroy();
            this[`dtTrigger${type + 1}`].next();
          }
        });
      });
  }

  clearDate(type: number) {
    if (type == 1) {
      this.reportByAcademy.endDate = '';
    } else if (type == 2) {
      this.reportByPaymentType.endDate = '';
    }
  }
}

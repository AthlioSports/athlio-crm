import { AfterViewInit, Component, Renderer, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StudentService } from '../../services/student/student.service';
import { ToastrService } from 'ngx-toastr';
import { AppSettings } from '../../apiUrls';
import { Http, Response, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { ExcelService } from './../../services/excel.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AcademyService } from '../../services/academy/academy.service';



class studentData {
  slNo: number;
  name: string;
  email: string;
  phone: string;
  academy_name: string;
  sport_name: string;
  coach_name: string;
  gender: string;
  chackValue: boolean;
  status: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  @ViewChild('fileUpload')
  selectedFileElement: ElementRef;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  dtStudentsList: studentData[];

  studentDetails: any = {};
  deleteId: string = '';
  userDetails: any = {};
  academyLogin: boolean = false;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private renderer: Renderer,
    private cookieService: CookieService,
    private excelService: ExcelService,
    private spinner: NgxSpinnerService,
    private academyService: AcademyService
  ) { }
  dummyData: any;
  academyData: any = {};
  isAcademyLogin = false;
  parentAcademyLogin = false;
  tableColumns = [];
  filters = {filterCity: "", sport: "", academy: "", ageGroup: ""};
  ngOnInit() {
    this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      this.academyLogin = true;
      this.academyData.academy = this.userDetails.id;
      this.filters.academy = this.userDetails.id;
      this.filters.filterCity = this.userDetails.city;
      this.isAcademyLogin = true;
      this.tableColumns = [
        { title: 'S.No', data: 'slNo', orderable: false, width: "3%" },
        { title: 'Name', data: 'name' },
        { title: 'Email', data: 'email' },
        { title: 'Mobile', data: 'phone' },
        { title: 'Academy', data: 'academy_name' },
        { title: 'Coach', data: 'coach_name' },
        // { title: 'Subscription Start',data: 'subscription_start' },
        { title: 'Batch', data: 'batch_name' },
        { title: 'Sport', data: 'sport_name' },
        { title: 'Gender', data: 'gender' },
        { title: 'Actions', data: '', orderable: false, width: "8%" },
        { title: 'Status', data: '', orderable: false, width: "6%" },
        // {data: "_id",title: "Id",visible: false},
      ]
      this.getAllSports();
    }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy') {
      this.academyData = { parentAcademy: this.userDetails.id };
      this.parentAcademyLogin = true;
      this.tableColumns = [
        { title: 'S.No', data: 'slNo', orderable: false, width: "3%" },
        { title: 'Name', data: 'name' },
        { title: 'Email', data: 'email' },
        { title: 'Mobile', data: 'phone' },
        { title: 'Academy', data: 'academy_name' },
        { title: 'Coach', data: 'coach_name' },
        { title: 'Batch', data: 'batch_name' },
        { title: 'Sport', data: 'sport_name' },
        { title: 'Gender', data: 'gender' },
       
      ]
      this.getAllSports();
    }else{
      this.tableColumns = [
        { title: 'S.No', data: 'slNo', orderable: false, width: "3%" },
        { title: 'Name', data: 'name' },
        { title: 'Email', data: 'email' },
        { title: 'Mobile', data: 'phone' },
        { title: 'Academy', data: 'academy_name' },
        { title: 'Coach', data: 'coach_name' },
        { title: 'Batch', data: 'batch_name' },
        { title: 'Sport', data: 'sport_name' },
        { title: 'Gender', data: 'gender' },
        // { title: 'Subscription Start',data: 'subscription_start' },
        { title: 'Actions', data: '', orderable: false, width: "8%" },
        { title: 'Status', data: '', orderable: false, width: "6%" },
        // {data: "_id",title: "Id",visible: false},
      ]
      this.getAllSports();
    }
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      // scrollY: "500px",
      serverSide: true,
      processing: true,
      retrieve: true,
      order: [],
      ajax: (dataTablesParameters: any, callback) => {
        that.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT + 'students/getListDt',
            Object.assign(dataTablesParameters, this.academyData, this.filters), {}
          ).subscribe((resp: any) => {
            // if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
            //   resp.data.data = resp.data.data.filter((student) => {
            //     return student.my_academies && student.my_academies.length && student.my_academies[0].academy == this.userDetails.id
            //   });
            //   resp.data.recordsTotal = resp.data.data.length;
            //   resp.data.recordsFiltered = resp.data.data.length;
            // }
            this.dtStudentsList = resp.data.data
            this.dtStudentsList = this.dtStudentsList.map((student) => {
              student.chackValue = student.status == 'Active' ? true : false;
              return student;
            });
            callback({
              recordsTotal: resp.data.recordsTotal,
              recordsFiltered: resp.data.recordsFiltered,
              data: []
            });
          });
      },
      columns: this.tableColumns
    };
    this.getAllAcademies();
    this.onActivate(event);
    this.getAllCitiesOfAcademies();
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  changeValue(status, id) {
    var updateObj = {
      id: id,
      status: status,
      type: "STATUS CHANGE"
    }
    this.studentService.updateDetails(updateObj).subscribe((data: any) => {
      // this.academyDetails = data.data;
      this.toastr.success("Student status updated successfully");
    }, error => {
      this.toastr.error(error.error.error.message);
    });
  }
  editData(id) {
    this.router.navigate(['/Sidemenu/students/addstudent/' + id], { queryParams: { type: 'EDIT'}});
  }
  viewData(id) {
    this.router.navigate(['/Sidemenu/students/addstudent/' + id], { queryParams: { type: 'VIEW'} });
    // // $("#coachDetails").modal('show');
    // this.studentService.getStudentDetails(id).subscribe((data: any) => {
    //   this.studentDetails = data.data;
    // }, error => {
    //   this.toastr.success('No data found.');
    // });
  }
  deleteStudent(id) {
    if (id) {
      this.studentService.deleteStudent(id).subscribe((data: any) => {
        // this.masterSportsList = data.data;
        // this.dtOptions.reloadData();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next('page');
        });
        this.toastr.success('Student removed successfully.');
      }, error => {
        this.toastr.error(error.error.error.message);
      });
    }
  }


  uploadedFile: any;
  onFileAdd(event) {
    this.uploadedFile = event.target.files[0];
  }
  uploadFile() {
    if (!this.uploadedFile) {
      this.toastr.error('Please select file');
      return;
    }
    const fd = new FormData();
    fd.append('studentsData', this.uploadedFile, this.uploadedFile.name);
    this.spinner.show();
    this.studentService.studentsBulkUpload(fd).subscribe((data: any) => {
      if (data.status == "200") {
        this.spinner.hide();
        this.toastr.success('Students upload is successful');
        this.closeAddExpenseModal.nativeElement.click();
        this.selectedFileElement.nativeElement.value = "";
        this.uploadedFile = '';
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next('page');
        });
      } else if (data.status == "400") {
        this.spinner.hide();
        if (data.data.length > 0) {
          this.excelService.exportAsExcelFile(data.data, 'InvalidStudents');
        }
        this.toastr.error(data.message);
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next('page');
        });
      }
      else if (data.status == "401") {
        this.spinner.hide();
        if (data.data.length > 0) {
          this.excelService.exportAsExcelFile(data.data, 'InvalidStudents');
        }
        this.toastr.error(data.message);
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next('page');
        });
      }
    }, (err) => {
      this.spinner.hide();
    })
  }
  ageGroups = [
    {name: "0-10"},
    {name: "10-12"},
    {name: "12-14"},
    {name: "14-17"},
    {name: "17-19"},
    {name: "19+"}
  ]
  removeFile() {
    this.selectedFileElement.nativeElement.value = "";
    this.uploadedFile = '';
  }
  cancelUpload() {
    this.selectedFileElement.nativeElement.value = "";
    this.uploadedFile = '';
    //this.closeAddExpenseModal.nativeElement.click();
  }
  downloadBulkUploadTemplate(){
    this.studentService.downloadBulkUploadTemplate().subscribe((data: any) => {
    })
  }

  allAcademyCities: any = [];
  getAllCitiesOfAcademies(){
    var postData = {};
    if(this.parentAcademyLogin){
      postData = { parentAcademy: this.userDetails.id };
    }
    this.academyService.getAllCitiesOfAcademies(postData).subscribe((data: any) => {
      if(data.data.status == 200){
        this.allAcademyCities = data.data.cities;
      }else{
        this.allAcademyCities = [];
      }
    }, error => {
      this.allAcademyCities = [];
    });
  }

  getSportsByAcademy(){
    this.filters = {filterCity: this.filters.filterCity, sport: "", academy: this.filters.academy, ageGroup: ""};
    var postData: any = {
      academy: this.filters.academy
    }
    if(this.parentAcademyLogin){
      postData.parentAcademy = this.userDetails.id
    }
    this.academyService.getSportsListByAcademyOrParentAcademyOrAll(postData).subscribe((data: any) => {
      if(data.status == "success"){
        this.allSports = data.data;
      }else{
        this.allSports = [];
      }
    }, error => {
      this.allSports = [];
    });
  }

  getAcademiesSportsAndAmenitiesByCity(){
    this.filters = {filterCity: this.filters.filterCity, sport: "", academy: "", ageGroup: ""};
    var postData: any = {
      city: this.filters.filterCity
    }
    if(this.parentAcademyLogin){
      postData.parentAcademy = this.userDetails.id
    }
    this.academyService.getAcademiesListByAcademyOrParentAcademyOrAll(postData).subscribe((data: any) => {
      if(data.status == "success"){
        this.allAcademies = data.data;
      }else{
        this.allAcademies = [];
      }
    }, error => {
      this.allAcademies = [];
    });
    this.academyService.getSportsListByAcademyOrParentAcademyOrAll(postData).subscribe((data: any) => {
      if(data.status == "success"){
        this.allSports = data.data;
      }else{
        this.allSports = [];
      }
    }, error => {
      this.allSports = [];
    });
  }

  allSports: any = [];
  getAllSports(){
    var postData = {};
    if(this.parentAcademyLogin){
      postData = { parentAcademy: this.userDetails.id };
    }else if(this.academyLogin){
      postData = { academy: this.userDetails.id };
    }
    this.academyService.getSportsListByAcademyOrParentAcademyOrAll(postData).subscribe((data: any) => {
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

  allAcademies: any = [];
  getAllAcademies(){
    var postData = {};
    if(this.parentAcademyLogin){
      postData = { parentAcademy: this.userDetails.id };
    }else if(this.academyLogin){
      postData = { academy: this.userDetails.id };
    }
    this.academyService.getAcademiesListByAcademyOrParentAcademyOrAll(postData).subscribe((data: any) => {
      if(data.status == "success"){
        this.allAcademies = data.data;
      }else{
        this.allAcademies = [];
      }
    }, error => {
      this.allAcademies = [];
    });
  }

  getStudentsByFilters(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
}

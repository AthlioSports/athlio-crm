import { AfterViewInit, Component, Renderer, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AcademyService } from '../../services/academy/academy.service';
import { ToastrService } from 'ngx-toastr';
import { AppSettings } from '../../apiUrls';
import { Http, Response, RequestOptions } from '@angular/http';
import { Routes, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CookieService } from 'angular2-cookie/core';
import { yearsPerPage } from '@angular/material/datepicker/typings/multi-year-view';
import { AppDateAdapter, APP_DATE_FORMATS } from './../../Utilities/date.datepicker';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatToolbarModule, MatTooltipModule } from "@angular/material";

declare var $: any;

class academyData {
  slNo: number;
  name: string;
  // email : string;
  sport: [];
  contact_person: string;
  mobile: string;
  // subscription_start : string;
  subscription_end: string;
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
  selector: 'app-academies-list',
  templateUrl: './academies-list.component.html',
  styleUrls: ['./academies-list.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class AcademiesListComponent implements OnInit,AfterViewInit,OnDestroy {

  constructor(
    private academyService: AcademyService,
    private router: Router, private toastr: ToastrService,
    private httpClient: HttpClient,
    private renderer: Renderer,
    private cookieService: CookieService
  ) { }
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  academiesList: any = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtAcademiesList: academyData[];
  academyDetails: any = {};
  deleteId: string = '';
  userDetails: any = {};
  academyLogin: boolean = false;
  parentAcademyLogin = false;
  currentLoginData = {};
  tableColumns = [];
  filters = {filterCity: "", sport: "", addedBefore: "", amenity: ""};
  ngOnInit() {
    this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      this.viewData(this.userDetails.id);
      this.academyLogin = true;
      this.tableColumns = [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Academy Name', data: 'name' },
        { title: 'Academy Sports', data: 'sport' },
        { title: 'Contact Person', data: 'contact_person' },
        { title: 'Mobile', data: 'mobile' },
        { title: 'Actions', data: 'slNo', orderable: false }
      ]
    }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy') {
      this.currentLoginData = { parentAcademy: this.userDetails.id };
      this.parentAcademyLogin = true;
      this.tableColumns = [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Academy Name', data: 'name' },
        { title: 'Academy Sports', data: 'sport' },
        { title: 'Contact Person', data: 'contact_person' },
        { title: 'Mobile', data: 'mobile' }
      ]
    }else{
      this.tableColumns = [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Academy Name', data: 'name' },
        { title: 'Academy Sports', data: 'sport' },
        { title: 'Contact Person', data: 'contact_person' },
        { title: 'Mobile', data: 'mobile' },
        { title: 'Actions', data: 'slNo', orderable: false }
      ]
    }
    const that = this;
    this.dtOptions = {

      pagingType: 'full_numbers',
      pageLength: 25,
      lengthMenu: [[-1, 5, 10, 25, 50, 100], ["ALL", 5, 10, 25, 50, 100]],
      serverSide: true,
      // scrollY: "500px",
      processing: true,
      retrieve: true,
      order: [[1, "asc"]],
      ajax: (dataTablesParameters: any, callback) => {
        that.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT + 'academies/getListDt',
            Object.assign(dataTablesParameters, this.currentLoginData, this.filters), {}
          ).subscribe((resp: any) => {
            this.dtAcademiesList = resp.data.data
            this.dtAcademiesList = this.dtAcademiesList.map((academy) => {
              academy.chackValue = academy.status == 'Active' ? true : false;
              return academy;
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

    this.onActivate(event);

    // this.academyService.getAcademiesList().subscribe((data : any) =>{
    // 	this.academiesList = data.data;
    // },error =>{
    //     this.toastr.success('No data found.');
    // });
    this.getAllSports();
    this.getAllCitiesOfAcademies();
    this.getAllAmenities();
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
    this.academyService.updateDetails(updateObj).subscribe((data: any) => {
      // this.academyDetails = data.data;
      this.toastr.success("Academy status updated successfully");
    }, error => {
      this.toastr.error(error.error.error.message);
    });
  }
  viewData(id) {
    this.router.navigate(['/Sidemenu/academies/addacademies/' + id], { queryParams: { type: 'VIEW'} });
    // this.academyService.getAcademyDetails(id).subscribe((data: any) => {
    //   this.academyDetails = data.data;
    //   this.academyDetails.amenities.sort(function (a, b) {
    //     if (a.toUpperCase() < b.toUpperCase()) { return -1; }
    //     if (a.toUpperCase() > b.toUpperCase()) { return 1; }
    //     return 0;
    //   });
    //   this.academyDetails.sport.sort(function (a, b) {
    //     if (a.toUpperCase() < b.toUpperCase()) { return -1; }
    //     if (a.toUpperCase() > b.toUpperCase()) { return 1; }
    //     return 0;
    //   });
    //   if (this.academyDetails.parentAcademyData.length > 0) {
    //     this.academyDetails.parentAcademyData = this.academyDetails.parentAcademyData[0]
    //   }
    //   this.academyDetails.subscriptionType = (new Date(this.academyDetails.subscription_end).getFullYear() - new Date(this.academyDetails.subscription_start).getFullYear()) + ' ' + 'Year(s)';
    // }, error => {
    //   this.toastr.success('No data found.');
    // });
  }
  editData(id) {
    this.router.navigate(['/Sidemenu/academies/addacademies/' + id], { queryParams: { type: 'EDIT'} });
  }

  deleteAcademy(id) {
    if (id) {
      this.academyService.deleteAcademy(id).subscribe((data: any) => {
        // this.masterSportsList = data.data;
        // this.dtOptions.reloadData();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next('page');
        });
        this.toastr.success('Academy removed successfully.');
      }, error => {
        this.toastr.error(error.error.error.message);
      });
    }
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

  allAmenities: any = [];
  getAllAmenities(){
    var postData = {};
    if(this.parentAcademyLogin){
      postData = { parentAcademy: this.userDetails.id };
    }else if(this.academyLogin){
      postData = { academy: this.userDetails.id };
    }
    this.academyService.getAmenitiesListByAcademyOrParentAcademyOrAll(postData).subscribe((data: any) => {
      if(data.status == "success"){
        this.allAmenities = data.data;
      }else{
        this.allAmenities = [];
      }
    }, error => {
      this.allAmenities = [];
    });
  }

  getAcademiesByFilters(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from './../apiUrls';
import { Subject } from 'rxjs';
import { AcademyService } from './../services/academy/academy.service';
import { ToastrService } from 'ngx-toastr';
import { Routes, RouterModule, Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-parent-academy',
  templateUrl: './parent-academy.component.html',
  styleUrls: ['./parent-academy.component.css']
})
export class ParentAcademyComponent implements OnInit {

  constructor(
    private httpClient: HttpClient,
    private academyService: AcademyService,
    private toastr: ToastrService,
    private router: Router,
    private cookieService: CookieService
  ) { }
  userDetails: any = {};
  parentAcademyLogin = false;

  ngOnInit() {
    this.dtOptions = this.getDtOptions();
    this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy') {
      this.parentAcademyLogin = true;
      this.viewData(this.userDetails.id);
    }
    this.onActivate(event);
  }
  onActivate(event) {
    window.scroll(0, 0);
  }
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  parentAcademiesList = [];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  academyData = {};

  getDtOptions() {
    return {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      retrieve: true,
      order: [[1, "asc"]],
      ajax: (dataTablesParameters: any, callback) => {
        this.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT + 'parent_academies/getListDt',
            Object.assign(dataTablesParameters, this.academyData), {}
          ).subscribe((resp: any) => {
            this.parentAcademiesList = resp.data.data;
            callback({
              recordsTotal: resp.data.recordsTotal,
              recordsFiltered: resp.data.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ title: 'S.No', data: 'slNo', orderable: false },
      { title: 'Academy Name', data: 'name' },
      { title: 'Contact Person', data: 'contact_person' },
      { title: 'City', data: 'city' },
      { title: 'Mobile', data: 'mobile' },
      { title: 'Actions', data: '', orderable: false }]
    };
  }

  academyDetails: any = {};
  viewData(id) {
    this.router.navigate(['/Sidemenu/parent-academy/create-parentAcademy/' + id], { queryParams: { type: 'VIEW'} });
    // this.academyService.getParentAcademyDetails({ id: id }).subscribe((data: any) => {
    //   this.academyDetails = data.data;
    // }, error => {
    //   this.toastr.success('No data found.');
    // });
  }

  editData(id) {
    this.router.navigate(['/Sidemenu/parent-academy/create-parentAcademy/' + id], { queryParams: { type: 'EDIT'} });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  deleteParentAcademyId: string;
  storeDeleteParentAcademyId(id) {
    this.deleteParentAcademyId = id;
  }
  deleteParentAcademy() {
    this.academyService.deleteParentAcademy({ parentAcademy: this.deleteParentAcademyId }).subscribe((data: any) => {
      if (data.data.status === 200) {
        this.toastr.success("Parent academy deleted successfully.");
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      }else{
        this.toastr.error(data.data.message)
      }
    }, error => {
      this.toastr.success('No data found.');
    });
  }

}

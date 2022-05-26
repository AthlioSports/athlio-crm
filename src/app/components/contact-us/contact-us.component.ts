import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'angular2-cookie/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AppSettings } from '../../apiUrls';
import { MasterDataService } from '../../services/master_data/master-data.service';

class amenityData {
  slNo : number;
  name : string;
  email:string;
  mobile:string;
  academy:string;
  city:string;
  from:string;
  created_date : string;
  message:string;
  id : string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtcontactList : amenityData[];
  constructor(
    private masterDataService : MasterDataService,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private cookieService: CookieService,
  ) { }

  dtTrigger: any;

  ngOnInit() {

    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      retrieve: true,
      order: [[ 1, "asc" ]],
      ajax: (dataTablesParameters: any, callback) => {
        that.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT + 'contactUs/getListDt',
            dataTablesParameters
          ).subscribe((resp : any)=> {
            this.dtcontactList = resp.data.data;
            callback({
              recordsTotal: resp.data.recordsTotal,
              recordsFiltered: resp.data.recordsFiltered,
              data: []
            });
          });
      },
      columns: [
        { title : 'S.No',data: 'slNo', orderable : false},
        { title : 'Name',data: 'name' },
        { title : 'Email',data: 'email' },
        { title : 'Mobile',data: 'mobile' },
        { title : 'Academy',data: 'academy' },
        { title : 'City',data: 'city' },
        { title : 'Source',data: 'from' },
        { title : 'Date',data: 'created_date' },
        { title : 'Message',data: 'message' }
        // { title : 'Action',data: '', orderable : false }
      ]
     
    };
    this.onActivate(event);
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

}

import { AfterViewInit, Component,Renderer, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { AppSettings } from '../../apiUrls';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CookieService } from 'angular2-cookie/core';
import { OtherUploadsService } from '../../services/other_uploads/other-uploads.service';
import { ToastrService } from 'ngx-toastr';
import { Routes, RouterModule , Router} from '@angular/router';


class otherData{
  slNo : number;
  type : string;
  name:string;
  subject : string;
  start_date : string;
  end_date : string;
  _id : string;
}


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-other-upload-list',
  templateUrl: './other-upload-list.component.html',
  styleUrls: ['./other-upload-list.component.css']
})


export class OtherUploadListComponent implements OnInit {

  constructor(private httpClient : HttpClient, private cookieService : CookieService, private otherUploadsService : OtherUploadsService, private toastr : ToastrService,private router: Router) { }
	@ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOthersList : otherData[];
  userDetails : any = {};
  details : any = {};

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  academyData: any = {};

  ngOnInit() {
    this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      this.academyData.academy = this.userDetails.id
    }
		const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      retrieve: true,
      order: [],
      ajax: (dataTablesParameters: any, callback) => {
        that.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT + 'other_uploads/getListDt',
            Object.assign(dataTablesParameters, this.academyData), {}
          ).subscribe((resp : any)=> {
            
            this.dtOthersList = resp.data.data;
            
            callback({
              recordsTotal: resp.data.recordsTotal,
              recordsFiltered: resp.data.recordsFiltered,
              data: []
            });
          });
      },
      columns: [
        { title : 'S.No',data: 'slNo', orderable : false},
        { title : 'Type',data: 'type'},
        { title : 'Name',data: 'name'},
        { title : 'Subject',data: 'subject'},
        { title : 'Start Date',data: 'start_date'},
        { title : 'End Date',data: 'end_date'},
        { title : 'Action',data: '', orderable : false }
      ]
    };
    this.onActivate(event);
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
  viewData(id){
    this.router.navigate(['/Sidemenu/others/createOthers/' + id], { queryParams: { type: 'VIEW'} });
    // this.otherUploadsService.getOtherUpload({id:id}).subscribe((data : any) =>{
    //   this.details = data.data;
    // },error =>{
    //   this.toastr.error(error.error.error.message);
    // });
  }
  deleteId: any;
  deleteData(id){
    this.otherUploadsService.deleteOtherUpload(id).subscribe((data : any) =>{
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next('page');
      });
    },error =>{
      this.toastr.error(error.error.error.message);
    });
  }
  editData(id){
    this.router.navigate(['/Sidemenu/others/createOthers/'+id], { queryParams: { type: 'EDIT'} });
  }
}

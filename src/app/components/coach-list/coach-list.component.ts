import { AfterViewInit, Component, Renderer, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CoachService } from '../../services/coach/coach.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../apiUrls';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { AcademyService } from '../../services/academy/academy.service';


class couchData {
  slNo: number;
  chief_coach:string;
  name: string;
  gender: string;
  phone: string;
  certification: string;
  academy_name: string;
  sport_name: string;
  level_name: string;
  _id: string;
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
  selector: 'app-coach-list',
  templateUrl: './coach-list.component.html',
  styleUrls: ['./coach-list.component.css']
})
export class CoachListComponent implements OnInit {

  constructor(
    private coachService: CoachService, 
    private router: Router, 
    private toastr: ToastrService, 
    private httpClient: HttpClient, 
    private cookieService: CookieService,
    private academyService: AcademyService
    ) { }
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  coachesList: any;
  dtCoachesList: couchData[];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();


  coachDetails: any = {};
  deleteId: string = '';
  userDetails: any = {};
  academyLogin: boolean = false;
  academyData: any = {};
  parentAcademyLogin = false;
  tableColumns = [];
  filters = {filterCity: "", sport: "", academy: "", certification: ""};
  certificationsPostData: any = {};

  ngOnInit() {
    this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      this.certificationsPostData = {
        academy: this.userDetails.id
      }
      this.academyLogin = true;
      this.getAllCertifications(this.certificationsPostData);
      this.academyData.academy = this.userDetails.id;
      this.filters.academy = this.userDetails.id;
      this.filters.filterCity = this.userDetails.city;
      this.getAllSports();
      this.tableColumns = [
        { title: 'S.No', data: 'slNo', orderable: false, width: "3%" },
        { title: 'Chief Coach', data: 'chief_coach' },
        { title: 'Name', data: 'name' },
        { title: ' Mobile', data: 'gender' },
        { title: 'Academy Name', data: 'academy_name' },
        { title: 'Gender', data: 'phone' },
        { title: 'Sport', data: 'sport_name' },
        { title: 'Level', data: 'level_name' },
        { title: 'Certification', data: 'certification' },
        { title: 'Actions', data: '', orderable: false, width: "15%" },
        // { title: 'Status', data: '', orderable: false, width: "5%" }
      ]
    }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy') {
      this.academyData = { parentAcademy: this.userDetails.id };
      this.parentAcademyLogin = true;
      this.certificationsPostData = {
        parentAcademy: this.userDetails.id
      }
      this.getAllCertifications(this.certificationsPostData);
      this.tableColumns = [
        { title: 'S.No', data: 'slNo', orderable: false, width: "3%" },
        { title: 'Chief Coach', data: 'name' },
        { title: 'Name', data: 'name' },
        { title: 'Mobile', data: 'gender' },
        { title: 'Academy Name', data: 'academy_name' },
        { title: 'Gender', data: 'phone' },
        { title: 'Sport', data: 'sport_name' },
        { title: 'Level', data: 'level_name' },
        { title: 'Certification', data: 'certification' }
      ]
      this.getAllSports();
    }else{
      this.getAllCertifications(this.certificationsPostData);
      this.tableColumns = [
        { title: 'S.No', data: 'slNo', orderable: false, width: "3%" },
        { title: 'Chief Coach', data: 'name' },
        { title: 'Name', data: 'name' },
        { title: 'Mobile', data: 'gender' },
        { title: 'Academy Name', data: 'academy_name' },
        { title: 'Gender', data: 'phone' },
        { title: 'Sport', data: 'sport_name' },
        { title: 'Level', data: 'level_name' },
        { title: 'Certification', data: 'certification' },
        { title: 'Actions', data: '', orderable: false, width: "15%" },
        // { title: 'Status', data: '', orderable: false, width: "5%" }
      ]
      this.getAllSports();
    }
    /*
    if(this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin'){
      this.academyLogin = true;      
    }*/
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      lengthMenu: [[-1, 5, 10, 25, 50, 100], ["ALL", 5, 10, 25, 50, 100]],
      serverSide: true,
      processing: true,
      retrieve: true,
      order: [],
      ajax: (dataTablesParameters: any, callback) => {
        that.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT + 'coaches/getCoachesListDt',
            Object.assign(dataTablesParameters, this.academyData, this.filters), {}
          ).subscribe((resp: any) => {
            // if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
            //   resp.data.data = resp.data.data.filter((coach) => {
            //     return coach.academy == this.userDetails.id
            //   });
            //   resp.data.data.map((item, i) => {
            //     item.slNo = i + 1;
            //   })
            //   resp.data.recordsTotal = resp.data.data.length;
            //   resp.data.recordsFiltered = resp.data.data.length;
            // }
            this.dtCoachesList = resp.data.data;
            this.dtCoachesList = this.dtCoachesList.map((coach) => {
              coach.chackValue = coach.status == 'Active' ? true : false;
              return coach;
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
    this.getAllAcademies();
    this.getAllCitiesOfAcademies();

  	/*this.coachService.getAllCoaches().subscribe((data : any) =>{
  		this.coachesList =( data.data;
  	},error =>{
        this.toastr.success('No data found.');
  	});*/
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
      type : "STATUS CHANGE"
    }
    this.coachService.updateDetails(updateObj).subscribe((data: any) => {
      // this.academyDetails = data.data;
      this.toastr.success("Coach status updated successfully");
    }, error => {
      this.toastr.error(error.error.error.message);
    });
  }
  viewData(id) {
    this.router.navigate(['/Sidemenu/coaches/addcoaches/' + id], {queryParams:{type: "VIEW"}});
    // $("#coachDetails").modal('show');
    // this.coachService.getCoachDetails(id).subscribe((data: any) => {
    //   this.coachDetails = data.data;
    // }, error => {
    //   this.toastr.success('No data found.');
    // });
  }
  editData(id) {
    this.router.navigate(['/Sidemenu/coaches/addcoaches/' + id], { queryParams: { type: 'EDIT'} });
  }
  deleteCoach(id) {
    if (id) {
      this.coachService.deleteCoach(id).subscribe((data: any) => {
        // this.masterSportsList = data.data;
        // this.dtOptions.reloadData();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
        this.toastr.success('Coach removed successfully.');
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

  allCertifications: any = [];
  getAllCertifications(data){
    this.academyService.getAllCertifications(data).subscribe((data: any) => {
      if(data.data.status == "200"){
        this.allCertifications = data.data.certifications;
      }else{
        this.allCertifications = [];
      }
    }, error => {
      this.allCertifications = [];
    });
  }

  getCoachesByFilters(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

}

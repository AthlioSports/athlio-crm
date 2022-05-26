import { AfterViewInit, Component, Renderer, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MasterDataService } from '../../services/master_data/master-data.service';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../apiUrls';
import { CookieService } from 'angular2-cookie/core';
import { AcademyService } from './../../services/academy/academy.service';
import { ValidationsService } from './../../services/validations/validations.service';

class courtData {
  slNo: number;
  sport_name: string;
  name: string;
  created_date: string;
  sport: string;
  _id: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-courts',
  templateUrl: './courts.component.html',
  styleUrls: ['./courts.component.css']
})
export class CourtsComponent implements OnInit {
  masterCourtsList: any = [];
  masterSportsList: any = [];
  formData: any = {};
  edit_id: string = '';
  showCourtEdit: boolean = false;
  dtCourtsList: courtData[];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private masterDataService: MasterDataService,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private academyService: AcademyService,
    private validationsService: ValidationsService
  ) { }
  deleteId: string = '';
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  /*getCourtsList() {
    this.masterDataService.getAllCourts().subscribe((data: any) => {
      this.masterCourtsList = data.data;
    }, error => {
    });
  }*/
  userDetails: any;
  academyData: any = {};
  ngOnInit() {
    var apiEndPoint;
    // this.getCourtsList();
    this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      apiEndPoint = `${AppSettings.API_ENDPOINT}courts/getAcademyCourts`;
      this.academyData.id = this.userDetails.id;
    } else {
      apiEndPoint = AppSettings.API_ENDPOINT + 'courts/getListDt'
    }
    this.masterDataService.getSports().subscribe((data: any) => {
      this.masterSportsList = data.data;
      this.masterSportsList.sort(function (a, b) {
        if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
      });
    }, error => {
    });
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      retrieve: true,
      order: [[1, "asc"]],
      ajax: (dataTablesParameters: any, callback) => {
        that.httpClient
          .post<DataTablesResponse>(
            apiEndPoint,
            Object.assign(dataTablesParameters, this.academyData), {}
          ).subscribe((resp: any) => {
            this.dtCourtsList = resp.data.data;
            callback({
              recordsTotal: resp.data.recordsTotal,
              recordsFiltered: resp.data.recordsFiltered,
              data: []
            });
          });
      },
      columns: this.getColumnsData()

    };
    this.onActivate(event);
  }
  onActivate(event) {
    window.scroll(0, 0);
  }
  getColumnsData() {
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      return [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Sport Name', data: 'sport_name' },
        { title: 'Court Name', data: 'name' },
        { title: 'Added On', data: 'created_date' }
      ]
    } else {
      return [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Sport Name', data: 'sport_name' },
        { title: 'Court Name', data: 'name' },
        { title: 'Added On', data: 'created_date' },
        { title: 'Actions', data: '', orderable: false }
      ]
    }
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  addCourt() {
    if (!this.formData.sport) {
      this.toastr.error('Sport Name is a mandatory field.');
      return;
    }
    if (!this.formData.name || !/\S/.test(this.formData.name)) {
      this.toastr.error('Court Name is a mandatory field.');
      return;
    }
    if (this.formData.name.length < 3) {
      this.toastr.error('Court Name should have atleast 3 characters.');
      return;
    }
    else {
      this.masterDataService.addCourt(this.formData).subscribe((data: any) => {
        this.formData = {};
        this.toastr.success('Court Added successfully');
        // this.getCourtsList();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
      }, error => {
        this.toastr.error(error.error.error.message);
      });

    }
  }
  edidCourt(id) {
    this.dtCourtsList.filter((court) => {
      if (court._id == id) {
        this.edit_id = id;
        this.formData.name = court.name;
        this.formData.sport = court.sport;
        return court.name;
      }
    })
    this.showCourtEdit = true;
  }
  updateCourt(id) {
    if (!this.formData.sport) {
      this.toastr.error('Sport Name is a mandatory field.');
      return;
    }
    if (!this.formData.name || !/\S/.test(this.formData.name)) {
      this.toastr.error('Court Name is a mandatory field.');
      return;
    }
    if (this.formData.name.length < 3) {
      this.toastr.error('Court Name should have atleast 3 characters.');
      return;
    }
    else {
      this.formData.id = this.edit_id;
      this.masterDataService.updateCourts(this.formData).subscribe((data: any) => {
        // this.getCourtsList();
        this.formData = {};
        this.showCourtEdit = false;
        this.toastr.success('Court updated successfully');
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
      }, error => {
        this.toastr.error(error.error.error.message);
      });
    }
  }
  deleteCourt(id) {
    if (id) {
      this.masterDataService.deleteCourt(id).subscribe((data: any) => {
        // this.masterSportsList = data.data;
        // this.dtOptions.reloadData();
        // this.getCourtsList();
        this.toastr.success('Court removed successfully.');
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
      }, error => {
        this.toastr.error(error.error.error.message);
      });
    }
  }

  alphabets_Space_NumberOnly(e){
    return this.validationsService.alphabets_Space_NumberOnly(e);
  }
}

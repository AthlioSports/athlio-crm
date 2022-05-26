import { AfterViewInit, Component, Renderer, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MasterDataService } from '../../services/master_data/master-data.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { AppSettings } from '../../apiUrls';
import { Subject } from 'rxjs';
import { CookieService } from 'angular2-cookie/core';
import { ValidationsService } from './../../services/validations/validations.service';


class sportData {
  slNo: number;
  name: string;
  created_date: string;
  _id: string;
}
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.css']
})
export class SportsComponent implements OnInit {
  masterSportsList: any = [];
  sportName: any = '';
  edit_id: any = '';
  showsportEdit: boolean = false;
  dtSportsList: sportData[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private masterDataService: MasterDataService,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private validationsService: ValidationsService
  ) { }
  deleteId: string = '';
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  @ViewChild('fileUpload')
  selectedFileElement: ElementRef;

  /*getMasterSports(){
    this.masterDataService.getSports().subscribe((data : any) =>{
      this.masterSportsList = data.data;
    },error =>{
    });
  }*/
  userDetails: any = {};
  academyData: any = {};
  parentacademy = false;
  ngOnInit() {
    // this.getMasterSports();
    this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      this.academyData.academy = this.userDetails.id
    } else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy') {
      this.parentacademy = true;
      this.academyData.parentAcademy = this.userDetails.id;
    }
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
            AppSettings.API_ENDPOINT + 'sports/getListDtTest',
            Object.assign(dataTablesParameters, this.academyData), {}
          ).subscribe((resp: any) => {
            this.dtSportsList = resp.data.data;
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
    if (this.userDetails && this.userDetails.type && (this.userDetails.type.toLowerCase() == 'academyadmin' || this.userDetails.type.toLowerCase() == 'parentacademy')) {
      return [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Name', data: 'name' },
        { title: 'Added On', data: 'created_date' },
        { title: 'Image', data: '', orderable: false }
      ]
    } else {
      return [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Name', data: 'name' },
        { title: 'Added On', data: 'created_date' },
        { title: 'Image', data: '', orderable: false },
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
  addSport() {
    if (!this.sportName || !/\S/.test(this.sportName)) {
      this.toastr.error('Sport Name is a mandatory field.');
      return;
    }
    // if (!/\S/.test(this.sportName)) {
    //   this.toastr.error('Sport name should not be empty.');
    //   return;
    // }
    if (this.sportName.length < 3) {
      this.toastr.error('Sport Name should have atleast 3 characters.');
      return;
    }
    if (!this.fileName) {
      this.toastr.error('Please upload sport image');
      return;
    } else {
      this.masterDataService.uploadPic(this.formImageData).subscribe((data: any) => {
        var sportData: any = {};
        sportData.imgUrl = data.data.result.files.sportImage[0].providerResponse.location;
        sportData.name = this.sportName
        this.masterDataService.addSport(sportData).subscribe((data: any) => {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
          // this.getMasterSports();
          this.sportName = '';
          this.fileName = '';
          this.qImgLocalPath = '';
          this.hideImgUploadBtn = false;
          this.selectedFileElement.nativeElement.value = "";
          this.formImageData = new FormData();
          this.toastr.success('Sport Added successfully');
        }, error => {
          this.toastr.error(error.error.error.message);
        });
      })
    }
  }
  // edidSport(id) {
  //   this.dtSportsList.filter((sport) => {
  //     if (sport._id == id) {
  //       this.edit_id = id;
  //       this.sportName = sport.name;
  //       return sport.name;
  //     }
  //   })
  //   this.showsportEdit = true;
  // }
  edidSport(currentSport) {
    this.edit_id = currentSport._id;
    this.sportName = currentSport.name;
    this.qImgLocalPath = currentSport.imgUrl;
    this.showsportEdit = true;
    this.hideImgUploadBtn = true;
  }
  cancelUpdate() {
    this.sportName = '';
    this.showsportEdit = false;
    this.fileName = '';
    this.qImgLocalPath = '';
    this.selectedFileElement.nativeElement.value = "";
    this.hideImgUploadBtn = false;
    this.formImageData = new FormData();
    let reader = new FileReader();
  }
  updateSport(id) {

    if (this.edit_id == '' || !this.sportName || !/\S/.test(this.sportName)) {
      this.toastr.error('Sport Name is a mandatory field.');
    }
    if (this.sportName.length < 3) {
      this.toastr.error('Sport Name should have atleast 3 characters.');
      return;
    }
     else {
      if (this.fileName) {
        this.masterDataService.uploadPic(this.formImageData).subscribe((data: any) => {
          var sportData: any = {};
          sportData.imgUrl = data.data.result.files.sportImage[0].providerResponse.location;
          sportData.name = this.sportName;
          sportData.id = this.edit_id;
          this.masterDataService.updateSport(sportData).subscribe((data: any) => {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
            });
            this.edit_id = '';
            this.sportName = '';
            this.showsportEdit = false;
            this.fileName = '';
            this.qImgLocalPath = '';
            this.selectedFileElement.nativeElement.value = "";
            this.hideImgUploadBtn = false;
            this.formImageData = new FormData();
            let reader = new FileReader();
            this.toastr.success('Sport updated successfully');
          }, error => {
            this.toastr.error(error.error.error.message);
          });
        })
      }
      else {
        if (this.qImgLocalPath) {
          this.masterDataService.updateSport({ id: this.edit_id, name: this.sportName }).subscribe((data: any) => {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
            });
            // this.edit_id = '';
            // this.sportName = '';
            // this.showsportEdit = false;
            this.edit_id = '';
            this.sportName = '';
            this.showsportEdit = false;
            this.fileName = '';
            this.qImgLocalPath = '';
            this.selectedFileElement.nativeElement.value = "";
            this.hideImgUploadBtn = false;
            this.formImageData = new FormData();
            let reader = new FileReader();
            this.toastr.success('Sport updated successfully');
          }, error => {
            this.toastr.error(error.error.error.message);
          });
        } else {
          this.toastr.error("Please select sport image");
        }
      }
    }
  }
  deleteSport(id) {
    if (id) {
      this.masterDataService.deleteSport(id).subscribe((data: any) => {
        // this.masterSportsList = data.data;
        // this.dtOptions.reloadData();
        // this.getMasterSports();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
        this.toastr.success('Sport removed successfully.');
      }, error => {
        this.toastr.error(error.error.error.message);
      });
    }
  }
  fileName: any;
  formImageData: FormData = new FormData();
  qImgLocalPath: any;
  hideImgUploadBtn: any = false;
  uploadProfilePic(event: any) {
    if (event.target.files && event.target.files[0]) {
      const fileDetails = event.target.files[0];
      this.fileName = fileDetails.name;
      this.formImageData.append('sportImage', event.target.files[0]);
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.qImgLocalPath = (<FileReader>event.target).result;
        this.hideImgUploadBtn = true;
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.fileName = '';
      this.qImgLocalPath = '';
      this.selectedFileElement.nativeElement.value = "";
      this.hideImgUploadBtn = false;
      this.formImageData = new FormData();
      let reader = new FileReader();
    }
  }
  removeSportImg() {
    this.fileName = '';
    this.qImgLocalPath = '';
    this.selectedFileElement.nativeElement.value = "";
    this.hideImgUploadBtn = false;
    this.formImageData = new FormData();
    let reader = new FileReader();
  }
  alphabetsAndSpaceOnly(e){
    return this.validationsService.alphabetsAndSpaceOnly(e);
  }

}

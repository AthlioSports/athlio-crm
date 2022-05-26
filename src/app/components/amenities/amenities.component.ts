import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'angular2-cookie/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { AppSettings } from '../../apiUrls';
import { MasterDataService } from '../../services/master_data/master-data.service';
import { ValidationsService } from './../../services/validations/validations.service';
class amenityData {
  slNo : number;
  name : string;
  created_date : string;
  id : string;
}


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.css']
})
export class AmenitiesComponent implements OnInit {
  name : any = '';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtAmenitysList : amenityData[];

  showaeminityEdit : boolean = false;
  constructor(
    private masterDataService : MasterDataService,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private validationsService: ValidationsService
  ) { }

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

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
            AppSettings.API_ENDPOINT + 'aminities/getListDt',
            dataTablesParameters
          ).subscribe((resp : any)=> {
            this.dtAmenitysList = resp.data.data;
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
        { title : 'Image',data: '', orderable : false },
        { title : 'Added On',data: 'created_date' },
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

  cancelUpdate() {
    this.name = '';
    this.showaeminityEdit = false;
    this.fileName = '';
    this.qImgLocalPath = '';
    this.selectedFileElement.nativeElement.value = "";
    this.hideImgUploadBtn = false;
    this.formImageData = new FormData();
    let reader = new FileReader();
  }


  addAmenity(){
    if(!this.name || !/\S/.test(this.name)){
        this.toastr.error('Amenity  Name is a mandatory field.');
        return;
    }
    if(this.name.length < 3){
      this.toastr.error('Amenity Name should have atleast 3 characters');
      return;
  }
    if (!this.fileName) {
      this.toastr.error('Please upload sport image');
      return;
    } else {
      this.masterDataService.uploadPic(this.formImageData).subscribe((data: any) => {
        var amenityData: any = {};
        amenityData.imgUrl = data.data.result.files.sportImage[0].providerResponse.location;
        amenityData.name = this.name
        this.masterDataService.addamenity(amenityData).subscribe((data : any) =>{
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
          this.name = '';
          this.fileName = '';
          this.qImgLocalPath = '';
          this.hideImgUploadBtn = false;
          this.selectedFileElement.nativeElement.value = "";
          this.formImageData = new FormData();
          this.toastr.success('Amenity Added successfully');
        },error =>{
          this.toastr.error(error.error.error.message);
        });
      })
    }
  }
  edit_id: any;
  edidAmenity(id){
    this.dtAmenitysList.filter((amenity: any) => {
     
      if(amenity._id == id){
        this.edit_id = id;
        this.name = amenity.name;
        this.qImgLocalPath = amenity.imgUrl;
        return amenity.name;
      }
    })
    this.showaeminityEdit = true;
    this.showaeminityEdit = true;
    this.hideImgUploadBtn = true;
  }


  updateamenity(id){
    if(this.edit_id == '' || !this.name || !/\S/.test(this.name)){
        this.toastr.error('Amenity Name is a mandatory field.');
        return;
    }
    if(this.edit_id == '' || this.name.length < 3){
      this.toastr.error('Amenity Name should have atleast 3 characters');
      return;
  }else {
      if (this.fileName) {
        this.masterDataService.uploadPic(this.formImageData).subscribe((data: any) => {
          var amenityData: any = {};
          debugger
          amenityData.imgUrl = data.data.result.files.sportImage[0].providerResponse.location;
          amenityData.name = this.name;
          amenityData.id = this.edit_id;
          this.masterDataService.updateamenity(amenityData).subscribe((data : any) =>{
            // this.getMasterSports();
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
            this.edit_id = '';
            this.name = '';
            this.fileName = '';
            this.qImgLocalPath = '';
            this.showaeminityEdit = false;
            this.selectedFileElement.nativeElement.value = "";
            this.hideImgUploadBtn = false;
            this.formImageData = new FormData();
            let reader = new FileReader();
            this.toastr.success('Amenity updated successfully'); 
          },error =>{
            this.toastr.error(error.error.error.message);
          });
        })
      }
      else {
        if (this.qImgLocalPath) {
          this.masterDataService.updateamenity({ id: this.edit_id, name: this.name }).subscribe((data: any) => {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
            });
            this.edit_id = '';
            this.name = '';
            this.fileName = '';
            this.qImgLocalPath = '';
            this.showaeminityEdit = false;
            this.selectedFileElement.nativeElement.value = "";
            this.hideImgUploadBtn = false;
            this.formImageData = new FormData();
            let reader = new FileReader();
            this.toastr.success('Amenity updated successfully');
          }, error => {
            this.toastr.error(error.error.error.message);
          });
        }else {
          this.toastr.error("Please select amenity image");
        }
      }
    }
  }

  fileName: any;
  formImageData: FormData = new FormData();
  qImgLocalPath: any;
  hideImgUploadBtn: any = false;
  @ViewChild('fileUpload')
  selectedFileElement: ElementRef;
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

  currentAmenityId: string;
  storeCurrentAmenityId(id){
    this.currentAmenityId = id;
  }

  deleteAmenity(){
    this.masterDataService.deleteAmenity({amenity: this.currentAmenityId}).subscribe((data : any) =>{
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
      this.toastr.success('Amenity deleted successfully');
    },error =>{
      this.toastr.error(error.error.error.message);
    });
  }

  alphabetsAndSpaceOnly(e){
    return this.validationsService.alphabetsAndSpaceOnly(e);
  }
}

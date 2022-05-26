import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { MasterDataService } from '../../services/master_data/master-data.service';
import { BannersService } from '../../services/banners/banners.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {

  constructor(private masterDataService: MasterDataService, private bannersService: BannersService, private toastr: ToastrService) { }
  fileName: any = '';
  @ViewChild('fileUpload')
  selectedFileElement: ElementRef;
  formImageData: FormData = new FormData();
  disableUpload: boolean = false;
  formData: any = {};
  allBanners: any;
  getAllBanners() {
    this.bannersService.getAllBanner().subscribe((data: any) => {
      this.allBanners = data.data;
    }, error => {
      this.toastr.error(error.error.error.message);
      this.disableUpload = false;
    });
  }
  ngOnInit() {
    this.getAllBanners();
    this.onActivate(event);
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

  uploadBanner(event: any) {
    if (event.target.files && event.target.files[0]) {
      const fileDetails = event.target.files[0];
      this.formData.name = fileDetails.name;
      this.formImageData.append('image', fileDetails);
      this.masterDataService.uploadPic(this.formImageData).subscribe((data: any) => {
        this.formData.image = '';
        this.formData.image = data.data.result.files.image[0].providerResponse.location;
        this.bannersService.saveBanner(this.formData).subscribe((data: any) => {
          this.toastr.success('Banner uploded successfully.');
          this.disableUpload = false;
          this.getAllBanners();
          this.selectedFileElement.nativeElement.value = "";
          this.formImageData.delete('image');
        }, error => {
          this.toastr.error(error.error.error.message);
          this.disableUpload = false;
        });
      });


    } else {
      this.fileName = '';
      this.formImageData = new FormData();
      let reader = new FileReader();
    }
  }
  deleteId: any;
  deleteimage(id) {
    this.bannersService.removeBanner(id).subscribe((data: any) => {
      this.toastr.success('Banner removed successfully.');
      this.getAllBanners();
    }, error => {
      this.toastr.error(error.error.error.message);
    });
  }
}

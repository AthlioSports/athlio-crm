import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { AppDateAdapter, APP_DATE_FORMATS } from './../../Utilities/date.datepicker';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatToolbarModule, MatTooltipModule } from "@angular/material";
import { AcademyService } from '../../services/academy/academy.service';
import { CookieService } from 'angular2-cookie/core';
import { ToastrService } from 'ngx-toastr';
import { Routes, ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MasterDataService } from '../../services/master_data/master-data.service';
import { OtherUploadsService } from '../../services/other_uploads/other-uploads.service';
import imageCompression from 'browser-image-compression';
import { NgxSpinnerService } from "ngx-spinner";
import { ValidationsService } from './../../services/validations/validations.service';
import {FormCanDeactivate} from '../../form-can-deactivate/form-can-deactivate';
import {NgForm} from "@angular/forms";
@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class OthersComponent extends FormCanDeactivate implements OnInit {
  @ViewChild('lF') form: NgForm;

  @ViewChild('fileUpload')
  selectedFileElement: ElementRef;
  @ViewChild('fileUpload2')
  linkFileElement: ElementRef;

  checkIfSubmit: boolean = false;
  formData: any = {};
  disableSubmit: boolean = false;
  academiesList: any = [];
  userDetails: any = {};
  academyLogin: boolean = false;
  sportsList: any = [];
  fileName: any = [];
  fileType: any = [];
  formFilesData: FormData = new FormData();
  qFileLocalPath: any = [];
  showCreateForm: boolean = true;
  updateDetails: any = {};
  disableInputs: boolean = false;


  constructor(
    private academyService: AcademyService,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private masterDataService: MasterDataService,
    private otherUploadsService: OtherUploadsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private validationsService: ValidationsService
  ) { 
    super()
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.type === "EDIT") {
        this.disableInputs = false;
      } else {
        this.disableInputs = true;
      }
    });
    if (this.activatedRoute.snapshot.params.otherId) {
      this.showCreateForm = false;
      this.otherUploadsService.getOtherUpload({ id: this.activatedRoute.snapshot.params.otherId }).subscribe((data: any) => {
        this.updateDetails = data.data;
        if (this.updateDetails.academy) {
          if (this.updateDetails.type == 'events') {
            this.academyService.getAcademiesList().subscribe((data: any) => {
              this.academiesList = data.data;
            }, error => {
            });
          }
          this.academySelected(this.updateDetails.academy);
          this.academySelected(this.updateDetails.academy);
        }

      }, error => {
        this.toastr.error(error.error.error.message);
      });

    } else {
      this.showCreateForm = true;
    }
    this.formData.type = 'ads';
    this.formData.linkType = "2";
    this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      this.formData.academy = this.userDetails.id;
      this.academyLogin = true;
      this.formData.academy = this.userDetails.id;
      this.formData.type = 'events';
      this.typeSelected(this.formData.type)
      this.academySelected(this.userDetails.id);
    }
    this.onActivate(event);
  }
  onActivate(event) {
    window.scroll(0, 0);
  }
  typeSelected(type) {
    if (type == 'events') {
      this.academyService.getAcademiesList().subscribe((data: any) => {
        this.academiesList = data.data;
        this.academiesList.sort(function (a, b) {
          if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
          return 0;
        });
      }, error => {
      });
    }
  }
  academySelected(academyId) {
    this.academyService.getAcademySports(academyId).subscribe((data: any) => {
      this.sportsList = data.data;
      this.sportsList.sort(function (a, b) {
        if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
      });
      this.formData.sport = '';
      if (this.sportsList.length == 0) {
        this.toastr.error('No sports available for academy.')
      }
    }, error => {
    });
  }

  editData(id) {
    this.router.navigate(['/Sidemenu/others/createOthers/' + this.activatedRoute.snapshot.params.academyId], { queryParams: { type: 'EDIT'} });
  }
  // uploadFiles(event: any) {

  //   if (event.target.files) {
  //     for (var fileIndex = 0; fileIndex < event.target.files.length; ++fileIndex) {
  //       var addedFiled = this.formFilesData.getAll('otherUploadFiles');
  //       var findFile = this.fileName.filter((fileData) => {
  //         return fileData == event.target.files[fileIndex].name;
  //       });
  //       if (!findFile.length) {
  //         this.fileName.push(event.target.files[fileIndex].name);
  //         this.fileType.push(event.target.files[fileIndex].type.split('/')[0]);
  //         this.formFilesData.append('otherUploadFiles', event.target.files[fileIndex]);
  //       }
  //       let reader = new FileReader();
  //       reader.onload = (event: ProgressEvent) => {
  //         var findFile = this.qFileLocalPath.filter((file) => {
  //           return file == (<FileReader>event.target).result;
  //         });
  //         if (!findFile.length) {
  //           this.qFileLocalPath.push((<FileReader>event.target).result);
  //         }
  //       };
  //       reader.readAsDataURL(event.target.files[fileIndex]);
  //     }
  //     this.selectedFileElement.nativeElement.value = "";
  //   } else {
  //     this.fileName = [];
  //     this.fileType = [];
  //     this.formFilesData = new FormData();
  //     let reader = new FileReader();
  //   }
  // }

  async uploadFiles(event: any) {
    this.spinner.show();
    if (event.target.files) {
      for (var fileIndex = 0; fileIndex < event.target.files.length; ++fileIndex) {
        var options = { maxSizeMB: 0.5, maxWidthOrHeight: 1024 }
        const result = await imageCompression(event.target.files[fileIndex], options);
        var addedFiled = this.formFilesData.getAll('otherUploadFiles');
        var findFile = this.fileName.filter((fileData) => {
          return fileData == event.target.files[fileIndex].name;
        });
        if (!findFile.length) {
          this.fileName.push(result.name);
          this.fileType.push(result.type.split('/')[0]);
          this.formFilesData.append('otherUploadFiles', result, event.target.files[fileIndex].name);
        }
        let reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onload = (event: ProgressEvent) => {
          var findFile = this.qFileLocalPath.filter((file) => {
            return file == (<FileReader>event.target).result;
          });
          if (!findFile.length) {
            this.qFileLocalPath.push((<FileReader>event.target).result);
          }
        };
      }
      this.selectedFileElement.nativeElement.value = "";
      this.spinner.hide();
    } else {
      this.fileName = [];
      this.fileType = [];
      this.formFilesData = new FormData();
      let reader = new FileReader();
      this.spinner.hide();
    }
  }
  removeFile(index) {
    let files = this.formFilesData.getAll('otherUploadFiles');
    this.qFileLocalPath.splice(index, 1);
    this.fileName.splice(index, 1);
    this.fileType.splice(index, 1);
    files.splice(index, 1);
    this.formFilesData.delete('otherUploadFiles');
    files.map((file) => {
      this.formFilesData.append('otherUploadFiles', file);
    });
  }

  saveOtherUploads() {
    this.disableSubmit = true;
    if (!this.formData.name || !/\S/.test(this.formData.name)) {
      this.toastr.error(' Name is required');
      return
    }
    if (this.formData.name.length < 3) {
      this.toastr.error(' Name should have atleast 3 characters');
      return
    }
    if (!this.formData.subject || !/\S/.test(this.formData.subject)) {
      this.toastr.error(' Subject is required');
      return
    }
    if (this.formData.subject.length < 3) {
      this.toastr.error(' Subject should have atleast 3 characters');
      return
    }
    if (!this.formData.start_date) {
      this.toastr.error(' Start Date is required');
      return
    }
    if (!this.formData.end_date) {
      this.toastr.error(' End Date is required');
      return
    }
    // if ((!this.formData.address || !/\S/.test(this.formData.address)) && this.formData.type == "events") {
    //   this.toastr.error(' Address is required');
    //   return
    // }
    // if (this.formData.address.length < 3) {
    //   this.toastr.error(' Address should have atleast 3 characters');
    //   return
    // }
    // if ((!this.formData.locality || !/\S/.test(this.formData.locality)) && this.formData.type == "events") {
    //   this.toastr.error(' Locality is required');
    //   return
    // }
    // if (this.formData.locality.length < 3) {
    //   this.toastr.error(' Locality should have atleast 3 characters');
    //   return
    // }
    // if ((!this.formData.city || !/\S/.test(this.formData.city)) && this.formData.type == "events") {
    //   this.toastr.error(' City is required');
    //   return
    // }
    // if (this.formData.city.length < 3) {
    //   this.toastr.error(' City should have atleast 3 characters');
    //   return
    // }
    if (!this.formData.message || !/\S/.test(this.formData.message)) {
      this.toastr.error(' Message is required');
      return
    }
    if (this.formData.message.length < 3) {
      this.toastr.error(' Message should have atleast 3 characters');
      return
    }
    if (this.formData.linkType != "2" && (!this.formData.link || !/\S/.test(this.formData.link)) && this.formData.type != "events") {
      this.toastr.error('link is required');
      return
    }
    if (this.formData.linkType == "2" && (!this.fileName2 || !/\S/.test(this.formData.fileName2)) && this.formData.type != "events") {
      this.toastr.error('Upload file is required(PDF / Images)');
      return
    }
    if (this.fileName.length) {
      this.masterDataService.uploadPic(this.formFilesData).subscribe((data: any) => {
        this.disableSubmit = false;
        this.formData.files = [];
        data.data.result.files.otherUploadFiles.map((imageData) => {
          this.formData.files.push({ type: imageData.type.split('/')[0], path: imageData.providerResponse.location, name: imageData.originalFilename });
        });
        if (this.fileName2) {
          this.masterDataService.uploadPic(this.formImageData).subscribe((data: any) => {
            this.formData.fileLink = data.data.result.files.linkFile[0].providerResponse.location;
            this.otherUploadsService.saveOtherUpload(this.formData).subscribe((data: any) => {
              // this.masterSportsList = data.data;
              this.disableSubmit = false;
              this.fileName2 = '';
              this.linkFileElement.nativeElement.value = "";
              this.toastr.success('Data added successfully.');
              this.checkIfSubmit = true;
              this.router.navigate(['/Sidemenu/others/othersList']);
            }, error => {
              this.disableSubmit = false;
              this.toastr.error(error.error.error.message);
            });
          })
        } else {
          if (this.formData.type == "events" || this.formData.linkType == "1") {
            this.otherUploadsService.saveOtherUpload(this.formData).subscribe((data: any) => {
              this.disableSubmit = false;
              this.toastr.success('Data added successfully.');
              this.checkIfSubmit = true;
              this.router.navigate(['/Sidemenu/others/othersList']);
            }, error => {
              this.disableSubmit = false;
              this.toastr.error(error.error.error.message);
            });
          } else {
            this.toastr.error("Upload file is required(PDF / Images)");
            this.disableSubmit = false;
          }
        }
      });
    } else {
      this.toastr.error("Please upload display image");
      this.disableSubmit = false;
      // this.otherUploadsService.saveOtherUpload(this.formData).subscribe((data: any) => {
      //   this.disableSubmit = false;
      //   this.toastr.success('Data added successfully.');
      //   this.router.navigate(['/Sidemenu/others/othersList']);
      // }, error => {
      //   this.disableSubmit = false;
      //   this.toastr.error(error.error.error.message);
      // });
    }
  }
  removeSavedFile(index) {
    this.updateDetails.files.splic(index, 1);
  }
  checkForDate(incomingDate) {
    var currentDate = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    if (incomingDate < currentDate) {
      this.toastr.error("You have selected past date");
    }
  }
  updateOtherUploads() {

    if (!this.updateDetails.name || !/\S/.test(this.updateDetails.name)) {
      this.toastr.error(' Name is required');
      return
    }
    if (this.updateDetails.name.length < 3) {
      this.toastr.error(' Name should have atleast 3 characters');
      return
    }
    if (!this.updateDetails.subject || !/\S/.test(this.updateDetails.subject)) {
      this.toastr.error(' Subject is required');
      return
    }
    if (this.updateDetails.subject.length < 3) {
      this.toastr.error(' Subject should have atleast 3 characters');
      return
    }
    if (!this.updateDetails.start_date) {
      this.toastr.error(' Start Date is required');
      return
    }
    if (!this.updateDetails.end_date) {
      this.toastr.error(' End Date is required');
      return
    }
    if ((!this.updateDetails.address || !/\S/.test(this.updateDetails.address)) && this.updateDetails.type == "events") {
      this.toastr.error(' Address is required');
      return
    }
    if (this.updateDetails.address && this.updateDetails.address.length < 3 ) {
      this.toastr.error(' Address should have atleast 3 characters');
      return
    }
    if ((!this.updateDetails.locality || !/\S/.test(this.updateDetails.locality)) && this.updateDetails.type == "events") {
      this.toastr.error(' Locality is required');
      return
    }
    if (this.updateDetails.locality && this.updateDetails.locality.length < 3) {
      this.toastr.error(' Locality should have atleast 3 characters');
      return
    }
    if ((!this.updateDetails.city || !/\S/.test(this.updateDetails.city)) && this.updateDetails.type == "events") {
      this.toastr.error(' City is required');
      return
    }
    if (this.updateDetails.city && this.updateDetails.city.length < 3) {
      this.toastr.error(' City should have atleast 3 characters');
      return
    }
    if (!this.updateDetails.message || !/\S/.test(this.updateDetails.message)) {
      this.toastr.error(' Message is required');
      return
    }
    if (this.updateDetails.message.length < 3) {
      this.toastr.error(' Message should have atleast 3 characters');
      return
    }
    if (this.updateDetails.linkType != "2" && (!this.updateDetails.link || !/\S/.test(this.updateDetails.link)) && this.updateDetails.type != "events") {
      this.toastr.error('link is required');
      return
    }
    if (this.updateDetails.linkType == "2" && (!this.updateDetails.fileLink && !this.fileName2) && this.updateDetails.type != "events") {
      this.toastr.error('Upload file is required(PDF / Images)');
      return
    }

    this.disableSubmit = true;
    this.updateDetails.id = this.updateDetails._id;
    if (this.fileName.length) {
      this.masterDataService.uploadPic(this.formFilesData).subscribe((data: any) => {
        this.disableSubmit = false;
        // this.formData.files = [];
        data.data.result.files.otherUploadFiles.map((imageData) => {
          this.updateDetails.files.push({ type: imageData.type.split('/')[0], path: imageData.providerResponse.location, name: imageData.originalFilename });
        });
        if (this.fileName2) {
          this.masterDataService.uploadPic(this.formImageData).subscribe((data: any) => {
            this.updateDetails.fileLink = data.data.result.files.linkFile[0].providerResponse.location;
            this.otherUploadsService.updateOtherUpload(this.updateDetails).subscribe((data: any) => {
              // this.masterSportsList = data.data;
              this.disableSubmit = false;
              this.toastr.success('Data updated successfully.');
              this.checkIfSubmit = true;
              this.router.navigate(['/Sidemenu/others/othersList']);
            }, error => {
              this.disableSubmit = false;
              this.toastr.error(error.error.error.message);
            });
          })
        } else {
          this.otherUploadsService.updateOtherUpload(this.updateDetails).subscribe((data: any) => {
            // this.masterSportsList = data.data;
            this.disableSubmit = false;
            this.toastr.success('Data updated successfully.');
            this.checkIfSubmit = true;
            this.router.navigate(['/Sidemenu/others/othersList']);
          }, error => {
            this.disableSubmit = false;
            this.toastr.error(error.error.error.message);
          });
        }
      });
    } else {
      if (this.fileName2) {
        this.masterDataService.uploadPic(this.formImageData).subscribe((data: any) => {
          this.updateDetails.fileLink = data.data.result.files.linkFile[0].providerResponse.location;
          this.otherUploadsService.updateOtherUpload(this.updateDetails).subscribe((data: any) => {
            // this.masterSportsList = data.data;
            this.disableSubmit = false;
            this.toastr.success('Data updated successfully.');
            this.router.navigate(['/Sidemenu/others/othersList']);
          }, error => {
            this.disableSubmit = false;
            this.toastr.error(error.error.error.message);
          });
        })
      } else {
        // if ((this.updateDetails.type == "events") || (this.updateDetails.type == "ads" && this.updateDetails.linkType == "1") && this.updateDetails.fileLink) {
        this.otherUploadsService.updateOtherUpload(this.updateDetails).subscribe((data: any) => {
          // this.masterSportsList = data.data;
          this.disableSubmit = false;
          this.toastr.success('Data updated successfully.');
          this.router.navigate(['/Sidemenu/others/othersList']);
        }, error => {
          this.disableSubmit = false;
          this.toastr.error(error.error.error.message);
        });
        // } else {
        //   this.toastr.error("File link upload is required");
        //   this.disableSubmit = false;
        // }
      }
    }
  }
  clearEndDate() {
    this.updateDetails.end_date = '';
    if (this.updateDetails.type == 'events') {
      this.updateDetails.last_date_to_register = '';
    }
  }
  currentImageIndex: any;
  removeUpdateImage(index) {
    this.updateDetails.files.splice(index, 1);
  }
  formImageData: FormData = new FormData();
  fileName2: any;
  uploadFiles2(event: any) {
    const fileDetails = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      if (!this.showCreateForm) {
        if (this.updateDetails.linkType == "2") {
          this.updateDetails.fileName = fileDetails.name;;
          this.fileName2 = fileDetails.name;
          this.formImageData.append('linkFile', event.target.files[0]);
        }
      } else {
        this.fileName2 = fileDetails.name;
        this.formData.fileName = fileDetails.name;
        this.formImageData.append('linkFile', event.target.files[0]);
      }
    } else {
      if (!this.showCreateForm) {
        this.updateDetails.fileName = '';
        this.fileName2 = '';
        this.linkFileElement.nativeElement.value = "";
        this.formImageData = new FormData();
      } else {
        this.formData.fileName = '';
        this.fileName2 = '';
        this.linkFileElement.nativeElement.value = "";
        this.formImageData = new FormData();
      }
    }
  }
  removeFileLink() {
    this.formData.fileName = '';
    this.fileName2 = '';
    this.linkFileElement.nativeElement.value = "";
    this.formImageData = new FormData();
  }
  removeFileLinkOnChange() {
    if (this.formData.linkType == "1") {
      this.formData.fileName = '';
      this.fileName2 = '';
      this.linkFileElement.nativeElement.value = "";
      this.formImageData = new FormData();
    }
  }
  removeFileLinkUpdate() {
    this.updateDetails.fileName = '';
    this.updateDetails.fileLink = '';
    this.fileName2 = '';
    this.linkFileElement.nativeElement.value = "";
    this.formImageData = new FormData();
  }
  removeFileLinkOnChangeUpdate() {
    if (this.updateDetails.linkType == "1") {
      this.updateDetails.fileName = '';
      this.fileName2 = '';
      this.linkFileElement.nativeElement.value = "";
      this.formImageData = new FormData();
    }
  }

  alphabets_dot_space_only(e){
    return this.validationsService.alphabets_dot_space_only(e);
  }
}

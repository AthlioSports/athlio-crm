import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { MasterDataService } from '../../services/master_data/master-data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AcademyService } from './../../services/academy/academy.service';


@Component({
  selector: 'app-subheader',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.css']
})
export class SubheaderComponent implements OnInit {

  constructor(
    private cookieService: CookieService,
    private masterDataService: MasterDataService,
    private router: Router,
    private toastr: ToastrService,
    private academyService: AcademyService
  ) { }
  Password: any = { oldPassword: '', newPassword: '', confirmPassword: '' };

  userDetails: any = {};
  academyLogin: boolean = false;
  parentAcademyLogin = false;
  @ViewChild('fileUpload') selectedFileElement: ElementRef;
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  @ViewChild('closeAddExpenseModal2') closeAddExpenseModal2: ElementRef;
  ngOnInit() {
    this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      this.academyLogin = true;
      this.getNewNotificationsCount({
        academy: this.userDetails.id
      })
    }
    this.getgAcademyProfilePic();
    // this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails.id) {
      this.userDetails = this.cookieService.getObject('loginResponce');
      if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
        this.academyLogin = true;
      }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy') {
        this.parentAcademyLogin = true;
      }
    }
  }
  fileName: any;
  formImageData = new FormData();
  qImgLocalPath: any;
  uploadProfilePic(event: any) {
    if (event.target.files && event.target.files[0]) {
      const fileDetails = event.target.files[0];
      this.fileName = fileDetails.name;
      this.formImageData.append('profile_pic', fileDetails);
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.qImgLocalPath = (<FileReader>event.target).result;
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.fileName = '';
      this.formImageData = new FormData();
      let reader = new FileReader();
    }
  }
  academyDetails: any = {};
  updateAcademyProfilePic() {
    if (this.fileName) {
      this.masterDataService.uploadPic(this.formImageData).subscribe((data: any) => {
        this.academyDetails.profile_pic = data.data.result.files.profile_pic[0].providerResponse.location;
        this.academyDetails.id = this.userDetails.id;
        this.academyService.updateAcademyProfilePic(this.academyDetails).subscribe((data: any) => {
          this.toastr.success('Profile pic updated successfully.');
          this.selectedFileElement.nativeElement.value = "";
          this.formImageData = new FormData();
          this.qImgLocalPath = '';
          this.getgAcademyProfilePic();
          this.closeAddExpenseModal.nativeElement.click();
        }, error => {
          this.toastr.error(error.error.error.message);
        });
      });
    } else {

    }
  }
  getgAcademyProfilePic() {
    this.academyService.getgAcademyProfilePic({ id: this.userDetails.id }).subscribe((data: any) => {
      this.userDetails.profile_pic = data.data.profile_pic;
      this.qImgLocalPath = data.data.profile_pic;;
    }, error => {
      this.toastr.error(error.error.error.message);
    });
  }

  navigateToNotifications(){
    this.newNotificationsCount = 0;
    this.router.navigate(['/Sidemenu/notifications']);
  }

  logout() {
    if (this.userDetails && this.userDetails.type && (this.userDetails.type.toLowerCase() == 'academyadmin' || this.userDetails.type.toLowerCase() == 'parentacademy')) {
      this.router.navigate(['/Login']);
    }else {
      this.router.navigate(['/superAdmin/Login']);
    }
    this.cookieService.removeAll();
  }

  updateChangepassword() {
    let error = [];

    if (this.Password.oldPassword == '') {
      error.push('Old password')
    }
    if (this.Password.newPassword == '') {
      error.push('New password')
    }
    if (this.Password.confirmPassword == '') {
      error.push('Confirm password')
    }

    if (error.length) {
      let errorMessage = '';
      if (error.length > 1) {
        errorMessage = error.toString() + " are required."
      } else {
        errorMessage = error.toString() + " is required."
      }
      this.toastr.error(errorMessage);
    } else if (this.Password.newPassword != this.Password.confirmPassword) {
      this.toastr.error("New Password and Confirm Password Should be same");
    } else {
      this.Password.academyId = this.userDetails.id;
      this.academyService.ChnagePassword(this.Password).subscribe((data: any) => {
        if (data.data.status === 200) {
          this.closeAddExpenseModal2.nativeElement.click();
          this.toastr.success('Password Updated successfully.');
          return;
        }
        this.toastr.error(data.data.message);
      });
    }
  }

  oldPasswordEye = true;
  newPasswordEye = true;
  confirmPasswordEye = true;
  showPassword(element, type) {
    if (element.type === "password") {
      element.type = "text";
      if (type == "OLD") {
        this.oldPasswordEye = false;
      } else if (type == "NEW") {
        this.newPasswordEye = false;
      } else if (type == "CONFIRM") {
        this.confirmPasswordEye = false;
      }
    } else {
      element.type = "password";
      if (type == "OLD") {
        this.oldPasswordEye = true;
      } else if (type == "NEW") {
        this.newPasswordEye = true;
      } else if (type == "CONFIRM") {
        this.confirmPasswordEye = true;
      }
    }
  }

  cancelPasswordChange() {
    this.Password = {};
    this.oldPasswordEye = true;
    this.newPasswordEye = true;
    this.confirmPasswordEye = true;
  }

  updateParentAcademyPassword(){
    let error = [];

    if (this.Password.oldPassword == '') {
      error.push('Old password')
    }
    if (this.Password.newPassword == '') {
      error.push('New password')
    }
    if (this.Password.confirmPassword == '') {
      error.push('Confirm password')
    }

    if (error.length) {
      let errorMessage = '';
      if (error.length > 1) {
        errorMessage = error.toString() + " are required."
      } else {
        errorMessage = error.toString() + " is required."
      }
      this.toastr.error(errorMessage);
    } else if (this.Password.newPassword != this.Password.confirmPassword) {
      this.toastr.error("New Password and Confirm Password Should be same");
    } else {
      this.Password.academyId = this.userDetails.id;
      this.academyService.updateParentAcademyPassword(this.Password).subscribe((data: any) => {
        if (data.data.status === 200) {
          this.closeAddExpenseModal2.nativeElement.click();
          this.toastr.success('Password Updated successfully.');
          return;
        }
        this.toastr.error(data.data.message);
      });
    }
  }

  newNotificationsCount = 0;
  getNewNotificationsCount(data){
    console.log(data);
    this.academyService.getNewNotificationsCount(data).subscribe(
      (data: any) => {
        this.newNotificationsCount = data.data.count;
      },
      error => {
        
      }
    );
  }

}

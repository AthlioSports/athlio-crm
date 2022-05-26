import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SuperUserService } from '../../services/super_user/super-user.service';
import { MasterDataService } from '../../services/master_data/master-data.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { CommonService } from './../../services/common.service';
import { ValidationsService } from './../../services/validations/validations.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private masterDataService: MasterDataService,
    private cookieService: CookieService,
    private superUserService: SuperUserService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private validationsService: ValidationsService,
    private router : Router
    ) { }
  userDetails: any = {};
  adminDetails: any = {};
  fileName: string = "";
  qImgLocalPath: any;
  disableSubmit: boolean = false;
  formImageData: FormData = new FormData();
  Password: any = { oldpassword: '', newpassword: '', confirmpassword: '' };
  isEdit = false;
  oldPasswordEye = true;
  newPasswordEye = true;
  confirmPasswordEye = true;
  editProfile() {
    this.isEdit = true;
  }
  cancelEdit() {
    this.isEdit = false;
    // this.router.navigate(['/dashboard']);
  }

  getUserDetails() {
    this.userDetails = this.cookieService.getObject('loginResponce');
    this.superUserService.getSuperUserDetails(this.userDetails.id).subscribe((data: any) => {
      this.adminDetails = data.data;
      this.cookieService.putObject('loginResponce', this.adminDetails);
      this.masterDataService.changeLoggedUser.next();
      this.qImgLocalPath = this.adminDetails.profile_pic
    }, error => {
      this.toastr.error(error.error.error.message);
    });
  }
  ngOnInit() {
    // getSuperUserDetails
    this.getUserDetails();
  }
  @ViewChild('fileUpload')
  selectedFileElement: ElementRef;
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  // @ViewChild('old') oldPassword: ElementRef;
  // @ViewChild('new') newPassword: ElementRef;
  // @ViewChild('confirm') confirmPassword: ElementRef;
  removeFile() {
    this.selectedFileElement.nativeElement.value = "";
    this.adminDetails.profile_pic = '';
    this.fileName = '';
    this.qImgLocalPath = '';
  }
  uploadProfilePic(event: any) {
    // alert('ff' + event.target.files[0].size);
    // alert('.. ' + (event.target.files[0].size/1024).toFixed(3));
    // alert('--- ' + (event.target.files[0].size/1048576).toFixed(3));

    if (event.target.files && event.target.files[0]) {
      const fileDetails = event.target.files[0];
      this.fileName = fileDetails.name;
      this.formImageData.append('profile_pic', fileDetails);

      let reader = new FileReader();
      // tslint:disable-next-line:no-shadowed-variable
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
  updateData() {
    if (!this.adminDetails.name) {
      this.toastr.error('Name is Required');
      return;
    }
    if (!this.adminDetails.phone) {
      this.toastr.error('Mobile Number is Required');
      return;
    }
    if (!this.commonService.validateMobileNumber(this.adminDetails.phone)) {
      this.toastr.error("Please enter valid mobile number");
      return;
    }
    if (this.adminDetails.alternate_phone && !this.commonService.validateMobileNumber(this.adminDetails.alternate_phone)) {
      this.toastr.error("Please enter valid alternate mobile number");
      return;
    }
    if (!this.adminDetails.email) {
      this.toastr.error('Email is Required');
      return;
    }

    if (!this.commonService.validateEmail(this.adminDetails.email)) {
      this.toastr.error("Please enter valid email");
      return;
    };

    if (this.adminDetails.alternate_phone && !this.commonService.validateMobileNumber(this.adminDetails.alternate_phone)) {
      this.toastr.error("Please enter valid alternate mobile number");
      this.disableSubmit = false;
      return;
    }

    this.disableSubmit = true;
    if (this.fileName) {
      this.masterDataService.uploadPic(this.formImageData).subscribe((data: any) => {
        this.adminDetails.profile_pic = data.data.result.files.profile_pic[0].providerResponse.location;
        this.superUserService.updateDetails(this.adminDetails).subscribe((data: any) => {
          this.toastr.success('Profile updated successfully.');
          this.getUserDetails();
          // this.router.navigate(['/Sidemenu/students/studentList']);
          this.disableSubmit = false;
          this.isEdit = false;
        }, error => {
          this.toastr.error(error.error.error.message);
          this.disableSubmit = false;
        });
      });
    } else {
      this.disableSubmit = false;
      this.superUserService.updateDetails(this.adminDetails).subscribe((data: any) => {
        this.toastr.success('Profile updated successfully.');
        this.getUserDetails();
        // this.router.navigate(['/Sidemenu/students/studentList']);
        this.disableSubmit = false;
        this.isEdit = false;
      }, error => {
        this.toastr.error(error.error.error.message);
        this.disableSubmit = false;
      });
    }
  }


  changePassword() {
    let error = [];
    /*if(this.Password.oldpassword == ''){

    }*/
    if (!this.Password.oldpassword) {
      this.toastr.error('Old Password is Required');
      return;
    }
    if (!this.Password.newpassword) {
      this.toastr.error('New Password is Required');
      return;
    }
    if (this.Password.newpassword.length < 4) {
      this.toastr.error('New password should have atleast 4 characters.');
      return;
    }
    if (!this.Password.confirmpassword) {
      this.toastr.error('Confirm Password is Required');
      return;
    }

    if (this.Password.oldpassword == '') {
      error.push('Old password')
    }
    if (this.Password.newpassword == '') {
      error.push('New password')
    }
    if (this.Password.confirmpassword == '') {
      error.push('Confirm password')
    }
    // || this.Password.newpassword == '' || this.Password.confirmpassword == ''

    if (error.length) {
      let errorMessage = '';
      if (error.length > 1) {
        errorMessage = error.toString() + " are required."
      } else {
        errorMessage = error.toString() + " is required."

      }
      this.toastr.error(errorMessage);
    } else if (this.Password.oldpassword != this.adminDetails.password) {
      this.toastr.error("Old Password is not matching");
    } else if (this.Password.newpassword != this.Password.confirmpassword) {
      this.toastr.error("New Password and Confirm Password Should be same");
    } else if (this.Password.oldpassword == this.Password.newpassword) {
      this.toastr.error("Old Password and New Password Should not be same");
    } else {
      this.superUserService.updateDetails({ id: this.adminDetails.id, password: this.Password.newpassword }).subscribe((data: any) => {
        this.Password = {};
        this.closeAddExpenseModal.nativeElement.click();
        this.toastr.success('Password Updated successfully.');
        this.getUserDetails();
        this.disableSubmit = false;
      }, error => {
        this.toastr.error(error.error.error.message);
        this.disableSubmit = false;
      });

    }

  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  mobileNumberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (event.target.selectionStart === 0) {
      return (charCode === 54 || charCode === 55 || charCode === 56 || charCode === 57);
    }
    else if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;
    }

    return true;

  }

  alphabets_dot_space_only(e){
    return this.validationsService.alphabets_dot_space_only(e);
  }


}

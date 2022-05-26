import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { MasterDataService } from '../../services/master_data/master-data.service';
import { CoachService } from '../../services/coach/coach.service';
import { AcademyService } from '../../services/academy/academy.service';
import { StudentService } from '../../services/student/student.service';
import { ToastrService } from 'ngx-toastr';
import { Routes, ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { CommonService } from './../../services/common.service';
import { ValidationsService } from './../../services/validations/validations.service';
// date format DD/MM/YYYY
import { AppDateAdapter, APP_DATE_FORMATS } from './../../Utilities/date.datepicker';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatToolbarModule, MatTooltipModule } from "@angular/material";
import {FormCanDeactivate} from '../../form-can-deactivate/form-can-deactivate';
import {NgForm} from "@angular/forms";
@Component({
  selector: 'app-addstudent',
  templateUrl: './addstudent.component.html',
  styleUrls: ['./addstudent.component.css'],

  // date format DD/MM/YYYY
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]

})
export class AddstudentComponent extends FormCanDeactivate implements OnInit {
  @ViewChild('aF') form: NgForm;

  fileName: string = "";
  formImageData: FormData = new FormData();
  qImgLocalPath: any;
  formData: any = {};
  disableSubmit: boolean = false;
  disableUpdate: boolean = false;
  academiesList: any = [];
  coachesList: any = [];
  sportsData: any = [];
  sportsList: any = [];
  star_time: string = '';
  end_time: string = '';
  batchesList: any = [];
  timingsData: any = [];
  currentDate: any = new Date();
  showCreateForm: boolean = true;
  updateStudentDetails: any = {};
  firstCall: boolean = false;
  userDetails: any = {};
  academyLogin: boolean = false;
  disableInputs: boolean = false;
  checkIfSubmit: boolean = false;
  constructor(
    private masterDataService: MasterDataService,
    private academyService: AcademyService,
    private coachService: CoachService,
    private toastr: ToastrService,
    private studentService: StudentService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private commonService: CommonService,
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
    this.academyService.getActiveAcademiesList().subscribe((data: any) => {
      this.academiesList = data.data;
      this.academiesList.sort(function (a, b) {
        if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
      });
    }, error => {
      this.toastr.error(error.error.error.message);
    });
    this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      this.formData.academy = this.userDetails.id;
      this.academyLogin = true;
    }
    if (this.activatedRoute.snapshot.params.studentId) {
      this.showCreateForm = false;
      this.studentService.getStudentDetails(this.activatedRoute.snapshot.params.studentId).subscribe((data: any) => {
        this.updateStudentDetails = data.data;
        if (this.updateStudentDetails.my_academies.length) {
          this.updateStudentDetails.academy = this.updateStudentDetails.my_academies[0].academy;
          this.updateStudentDetails.sport = this.updateStudentDetails.my_academies[0].sport;
          this.updateStudentDetails.batch = this.updateStudentDetails.my_academies[0].batch;
          this.updateStudentDetails.coach = this.updateStudentDetails.my_academies[0].coach;
          if (this.updateStudentDetails.date_of_birth) {
            this.updateStudentDetails.date_of_birth = new Date(this.updateStudentDetails.date_of_birth);
          }
          if (this.updateStudentDetails.subscription_start) {
            this.updateStudentDetails.subscription_start = new Date(this.updateStudentDetails.subscription_start);
          }
          if (this.updateStudentDetails.subscription_end) {
            this.updateStudentDetails.subscription_end = new Date(this.updateStudentDetails.subscription_end);
          }
          if (this.updateStudentDetails.joining_date) {
            this.updateStudentDetails.joining_date = new Date(this.updateStudentDetails.joining_date);
          }
          if (this.updateStudentDetails.my_academies[0].timings && this.updateStudentDetails.my_academies[0].timings._id)
            this.updateStudentDetails.timings = this.updateStudentDetails.my_academies[0].timings._id;
          this.academySelected(this.updateStudentDetails.academy, 'EDIT');
          this.sportSelected(this.updateStudentDetails.sport, "EDIT");
          this.coachSelected(this.updateStudentDetails.coach, "EDIT");
          this.batchSelected(this.updateStudentDetails.batch, this.updateStudentDetails.sport, 'EDIT');
        }
      }, error => {
        this.toastr.success('No data found.');
      });
    } else {
      this.showCreateForm = true;
      if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
        this.academySelected(this.formData.academy, '');
      }
    }
    this.onActivate(event);
  }

  onActivate(event) {
    window.scroll(0, 0);
  }
  editData(id) {
    this.router.navigate(['/Sidemenu/students/addstudent/' + this.activatedRoute.snapshot.params.studentId], { queryParams: { type: 'EDIT'} });
  }
  @ViewChild('fileUpload')
  selectedFileElement: ElementRef;
  academySelected(academyId, type) {
    this.academyService.getAcademySports(academyId).subscribe((data: any) => {
      this.sportsList = data.data;
      this.sportsList.sort(function (a, b) {
        if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
      });
      if (type != "EDIT") {
        this.coachesList = [];
        this.batchesList = [];
        this.timingsData = [];
      }
      if (this.showCreateForm) {
        this.formData.sport = '';
        this.formData.coach = '';
        this.formData.batch = '';
        this.formData.timings = '';
      } else {
        if (type != "EDIT") {
          this.updateStudentDetails.sport = '';
          this.updateStudentDetails.coach = '';
          this.updateStudentDetails.batch = '';
          this.updateStudentDetails.timings = '';
        }
      }
      if (this.sportsList.length == 0) {
        this.toastr.error('No sports available for academy.')
      }
    }, error => {
    });
    /*this.coachService.getAcademyCoaches(academyId).subscribe((data : any) =>{
      this.coachesList = data.data;
      this.formData.coach = '';
      this.formData.sport = '';
      this.sportsData = [];
      if(this.coachesList.length == 0){
        this.toastr.error('No coaches available for academy.')
      }
    },error =>{
      this.toastr.error(error.error.error.message);
    });*/
  }
  sportSelected(sportId, type) {
    // getAcademySportCoaches
    let academy = this.formData.academy ? this.formData.academy : this.updateStudentDetails.academy;
    this.coachService.getAcademySportCoaches(academy, sportId).subscribe((data: any) => {
      this.coachesList = data.data;
      this.coachesList.sort(function (a, b) {
        if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
      });
      if (type != "EDIT") {
        this.batchesList = [];
        this.timingsData = [];
      }
      if (this.showCreateForm) {
        this.formData.coach = '';
        this.formData.batch = '';
        this.formData.timings = '';
      } else {
        if (type != "EDIT") {
          this.updateStudentDetails.coach = '';
          this.updateStudentDetails.batch = '';
          this.updateStudentDetails.timings = '';
        }
      }
      if (this.coachesList.length == 0) {
        this.toastr.error('No coaches available.')
      }
    }, error => {
      this.toastr.error(error.error.error.message);
    });
  }
  coachSelected(coachId, type) {
    this.coachService.getBathes(coachId).subscribe((data: any) => {
      this.batchesList = data.data;
      this.batchesList.sort(function (a, b) {
        if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
      });
      if (type != "EDIT") {
        this.timingsData = [];
      }
      if (this.showCreateForm) {
        this.formData.batch = '';
        this.formData.timings = '';
      } else {
        if (type != "EDIT") {
          this.updateStudentDetails.batch = '';
          this.updateStudentDetails.timings = '';
        }
      }
      if (this.batchesList.length == 0) {
        this.toastr.error('No batches available for coach.')
      }
    }, error => {
      if (error.error.error.message.toLowerCase() == "please add batch") {
        this.toastr.error('Batch is not available.');
      } else {
        this.toastr.error(error.error.error.message);
      }
    });
  }
  batchSelected(batchId, sport, type) {
    let sendObj = {};
    if (this.showCreateForm) {
      sendObj = {
        "academy": this.formData.academy,
        "sport": this.formData.sport,
        "student_batch": batchId
      }
    } else {
      sendObj = {
        "academy": this.updateStudentDetails.academy,
        "sport": this.updateStudentDetails.sport,
        "student_batch": batchId
      }
    }
    this.academyService.getAcademySportTimings(sendObj).subscribe((data: any) => {
      this.timingsData = data.data;
      if (this.showCreateForm) {
        this.formData.timings = data.data.id;
      } else {
        if (type != "EDIT") {
          this.updateStudentDetails.timings = data.data.id;
        }
      }
    }, error => {
      this.timingsData = [];
      if (this.showCreateForm) {
        this.formData.timings = '';
      } else {
        if (type != "EDIT") {
          this.updateStudentDetails.timings = '';
        }
      }
      this.toastr.error(error.error.error.message);
    })
  }
  getSelectedBatchesTimings(batch) {
    let sendObj = {
      "academy": this.formData.academy,
      "sport": this.formData.sport,
      "student_batch": batch
    }
    this.academyService.getAcademySportTimings(sendObj).subscribe((data: any) => {
      this.formData.timings = data.data.id;
    }, error => {
      this.toastr.error(error.error.error.message);
    })
  }
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
  uploadUpdateProfilePic(event: any) {
    if (event.target.files && event.target.files[0]) {
      const fileDetails = event.target.files[0];
      this.fileName = fileDetails.name;
      this.formImageData.append('profile_pic', fileDetails);

      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.updateStudentDetails.profile_pic = (<FileReader>event.target).result;
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.fileName = '';
      this.formImageData = new FormData();
      let reader = new FileReader();
    }
  }
  removeFile() {
    this.selectedFileElement.nativeElement.value = "";
    this.formData.profile_pic = '';
    this.fileName = '';
    this.qImgLocalPath = '';
  }
  removeUpdateFile() {
    this.selectedFileElement.nativeElement.value = "";
    this.updateStudentDetails.profile_pic = '';
  }
  addStudent() {
    // if (!this.formData.email || !/\S/.test(this.formData.email)) {
    //   this.toastr.error("Please enter email");
    //   this.disableSubmit = false;
    //   return;
    // }
    if (this.formData.parentName && this.formData.parentName.length < 3 ) {
      this.toastr.error("Parent Name should have atleast 3 characters");
      return;
    }
    if (this.formData.display_name && this.formData.display_name.length < 2 ) {
      this.toastr.error("Display Name should have atleast 2 characters");
      return;
    }

    if (this.formData.email && !this.commonService.validateEmail(this.formData.email)) {
      this.toastr.error(`Invalid e-mail address! Kindly recheck and re-enter the correct e-mail
      address.`);
      return;
    }
    if (!this.formData.name || !/\S/.test(this.formData.name)) {
      this.toastr.error("Student Name is a mandatory field.");
      return;
    }
    if (this.formData.name.length < 3 ) {
      this.toastr.error("Student Name should have atleast 3 characters");
      return;
    }
    if (!this.formData.phone || !/\S/.test(this.formData.phone)) {
      this.toastr.error("Mobile number is a mandatory field.");
      return;
    }
    if (!this.commonService.validateMobileNumber(this.formData.phone)) {
      this.toastr.error(`Invalid mobile number! Kindly recheck and re-enter the correct mobile
      number.`);
      return;
    }

 if (!this.formData.date_of_birth || !/\S/.test(this.formData.joining_date)) {
      this.toastr.error("Date of birth is a mandatory field.");
      return;
    }

    if (!this.formData.gender) {
      this.toastr.error("Gender is a mandatory field.");
      return;
    }
    if (!this.formData.academy) {
      this.toastr.error("Academy is a mandatory field.");
      return;
    }
    if (!this.formData.sport) {
      this.toastr.error("Sport is a mandatory field.");
      return;
    }
    if (!this.formData.coach) {
      this.toastr.error("Coach is a mandatory field.");
      return;
    }
    if (!this.formData.batch) {
      this.toastr.error("Batch is a mandatory field.");
      return;
    }

   if (!this.formData.joining_date || !/\S/.test(this.formData.joining_date)) {
      this.toastr.error("Joining date is a mandatory field.");
      return;
    }


    
    // if (!this.formData.address || !/\S/.test(this.formData.address)) {
    //   this.toastr.error("Address is required");
    //   this.disableSubmit = false;
    //   return;
    // }
    

    // if (!this.formData.academy || !this.formData.coach || !this.formData.sport || !this.formData.batch) {
    //   this.disableSubmit = false;
    //   if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
    //     this.toastr.error('To add student, Please select Coach, Sport and batch.');
    //   } else {
    //     this.toastr.error('To add student, Please select Academy, Coach, Sport and batch.');
    //   }
    // }
     else {
      if (this.fileName) {
        this.masterDataService.uploadPic(this.formImageData).subscribe((data: any) => {
          this.formData.profile_pic = data.data.result.files.profile_pic[0].providerResponse.location;
          this.formData.joining_date = new Date(this.formData.joining_date.getTime() + (5 * 60 * 60 * 1000) + (30 * 60 * 1000));
          if (this.formData.date_of_birth) {
            this.formData.date_of_birth = new Date(this.formData.date_of_birth.getTime() + (5 * 60 * 60 * 1000) + (30 * 60 * 1000));
          }
          this.studentService.saveStudent(this.formData).subscribe((data: any) => {
            this.toastr.success('Student created successfully.');
            this.router.navigate(['/Sidemenu/students/studentList']);
            this.disableSubmit = false;
          }, error => {
            this.formData.joining_date = new Date(this.formData.joining_date.getTime() - (5 * 60 * 60 * 1000) - (30 * 60 * 1000));
            if (this.formData.date_of_birth) {
              this.formData.date_of_birth = new Date(this.formData.date_of_birth.getTime() - (5 * 60 * 60 * 1000) - (30 * 60 * 1000));
            }
            this.toastr.error(error.error.error.message);
            this.disableSubmit = false;
          });
        });
      } else {
        this.disableSubmit = false;
        this.formData.joining_date = new Date(this.formData.joining_date.getTime() + (5 * 60 * 60 * 1000) + (30 * 60 * 1000));
        if (this.formData.date_of_birth) {
          this.formData.date_of_birth = new Date(this.formData.date_of_birth.getTime() + (5 * 60 * 60 * 1000) + (30 * 60 * 1000));
        }
        this.studentService.saveStudent(this.formData).subscribe((data: any) => {
          this.toastr.success('Student created successfully.');
          this.checkIfSubmit = true;
          this.router.navigate(['/Sidemenu/students/studentList']);
          this.disableSubmit = false;
        }, error => {
          this.formData.joining_date = new Date(this.formData.joining_date.getTime() - (5 * 60 * 60 * 1000) - (30 * 60 * 1000));
          if (this.formData.date_of_birth) {
            this.formData.date_of_birth = new Date(this.formData.date_of_birth.getTime() - (5 * 60 * 60 * 1000) - (30 * 60 * 1000));
          }
          this.toastr.error(error.error.error.message);
          this.disableSubmit = false;
        });
      }
    }
  }
  updateStudent() {
    if (this.updateStudentDetails.parentName && this.updateStudentDetails.parentName.length < 3 ) {
      this.toastr.error("Parent Name should have atleast 3 characters");
      return;
    }
    if (this.updateStudentDetails.display_name && this.updateStudentDetails.display_name.length < 2 ) {
      this.toastr.error("Display Name should have atleast 2 characters");
      return;
    }

    if (!this.updateStudentDetails.name || !/\S/.test(this.updateStudentDetails.name)) {
      this.toastr.error(' Student Name is a mandatory field.');
      this.disableUpdate = false;
      return
    }
    if (this.updateStudentDetails.name.length < 3) {
      this.toastr.error('Student Name Name should have atleast 3 characters');
      this.disableUpdate = false;
      return
    }
    // if (!this.updateStudentDetails.address || !/\S/.test(this.updateStudentDetails.address)) {
    //   this.toastr.error('Address is required');
    //   this.disableUpdate = false;
    //   return
    // }

    if (this.updateStudentDetails.phone && !this.commonService.validateMobileNumber(this.updateStudentDetails.phone)) {
      this.toastr.error(`Invalid mobile number! Kindly recheck and re-enter the correct mobile
      number.`);
      this.disableSubmit = false;
      return;
    }

    this.updateStudentDetails.id = this.updateStudentDetails._id;
    //delete this.updateStudentDetails._id
    this.disableUpdate = true
    if (!this.updateStudentDetails.academy || !this.updateStudentDetails.coach || !this.updateStudentDetails.sport || !this.updateStudentDetails.batch) {
      this.disableUpdate = false;
      this.toastr.error('To add student, Please select Academy, Coach, Sport and batch.');
    } else {
      if (this.fileName) {
        this.masterDataService.uploadPic(this.formImageData).subscribe((data: any) => {
          this.updateStudentDetails.profile_pic = data.data.result.files.profile_pic[0].providerResponse.location;
          this.studentService.updateDetails(this.updateStudentDetails).subscribe((data: any) => {
            this.toastr.success('Student updated successfully.');
            this.checkIfSubmit = true;
            this.router.navigate(['/Sidemenu/students/studentList']);
            this.disableUpdate = false;
          }, error => {
            this.toastr.error(error.error.error.message);
            this.disableUpdate = false;
          });
        });
      } else {
        this.disableUpdate = false;
        this.studentService.updateDetails(this.updateStudentDetails).subscribe((data: any) => {
          this.toastr.success('Student updated successfully.');
          this.checkIfSubmit = true;
          this.router.navigate(['/Sidemenu/students/studentList']);
          this.disableUpdate = false;
        }, error => {
          this.toastr.error(error.error.error.message);
          this.disableUpdate = false;
        });
      }
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

import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AcademyService } from "../../services/academy/academy.service";
import { MasterDataService } from "../../services/master_data/master-data.service";
import { CoachService } from "../../services/coach/coach.service";
import { ToastrService } from "ngx-toastr";
import { Routes, ActivatedRoute, RouterModule, Router } from "@angular/router";
import { CookieService } from "angular2-cookie/core";
import { ValidationsService } from './../../services/validations/validations.service';
import {
  AppDateAdapter,
  APP_DATE_FORMATS
} from "./../../Utilities/date.datepicker";
import { CommonService } from "./../../services/common.service";

import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
  MatToolbarModule,
  MatTooltipModule
} from "@angular/material";
import { NgxSpinnerService } from "ngx-spinner";
import {FormCanDeactivate} from '../../form-can-deactivate/form-can-deactivate';
import {NgForm} from "@angular/forms";
@Component({
  selector: "app-add-coach",
  templateUrl: "./add-coach.component.html",
  styleUrls: ["./add-coach.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS
    }
  ]
})
export class AddCoachComponent extends FormCanDeactivate implements OnInit {
  @ViewChild('aF') form: NgForm;

  formData: any = {};
  updateCoachDetails: any = {};
  academiesList: any;
  coachLevelsList: any;
  batches: any = [];
  sportsList: any = [];
  batchesList: any = [];
  daysList: any = [];
  timings: any = [];
  chiefCoachesList: any = [];
  day: any = [];
  batch: string = "";
  start_time: string = "";
  end_time: string = "";
  date_of_birth: string = "";
  userDetails: any;
  showAmenityEdit: boolean = false;
  currentTimeIndex: number;
  currentDate: any = new Date();
  showCreateForm: boolean = true;
  academyLogin: boolean = false;
  disableInputs: boolean = false;
  qImgLocalPath: any;
  fileName: string = "";
  formImageData: FormData = new FormData();
  checkIfSubmit: boolean = false;
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private toastr: ToastrService,
    private academyService: AcademyService,
    private masterDataService: MasterDataService,
    private coachService: CoachService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private validationsService: ValidationsService
  ) {
    super()
  }

  @ViewChild("fileUpload") selectedFileElement: ElementRef;
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.type === "EDIT") {
        this.disableInputs = false;
      } else {
        this.disableInputs = true;
      }
    });
    this.userDetails = this.cookieService.getObject("loginResponce");
    if (
      this.userDetails &&
      this.userDetails.type &&
      this.userDetails.type.toLowerCase() == "academyadmin"
    ) {
      this.formData.academy = this.userDetails.id;
      this.academySelected(this.formData.academy);
      this.academyLogin = true;
    }
    this.academyService.getActiveAcademiesList().subscribe(
      (data: any) => {
        this.academiesList = data.data;
        this.academiesList.sort(function(a, b) {
          if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1;
          }
          if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1;
          }
          return 0;
        });
      },
      error => {}
    );
    this.masterDataService.getCoachLevels().subscribe(
      (data: any) => {
        this.coachLevelsList = data.data;
      },
      error => {}
    );
    this.masterDataService.getDays().subscribe(
      (data: any) => {
        this.daysList = data.data;
      },
      error => {}
    );
    if (this.activatedRoute.snapshot.params.coachId) {
      this.showCreateForm = false;
      this.coachService
        .getCoachDetails(this.activatedRoute.snapshot.params.coachId)
        .subscribe(
          (data: any) => {
            this.updateCoachDetails = data.data;
            this.updateCoachDetails.batches = data.data.student_batch;
            if (this.updateCoachDetails.chief_coach === "true") {
              this.updateCoachDetails.chief_coach = true;
            } else {
              this.updateCoachDetails.chief_coach = false;
            }
            if (this.updateCoachDetails.date_of_birth) {
              var dateArr = this.updateCoachDetails.date_of_birth.split("-");
              this.updateCoachDetails.date_of_birth = new Date(
                dateArr[2],
                parseInt(dateArr[1]) - 1,
                dateArr[0]
              );
            }
            this.academySelected(this.updateCoachDetails.academy);
          },
          error => {
            this.toastr.success("No data found.");
          }
        );
    } else {
      this.showCreateForm = true;
    }
    this.onActivate(event);
  }
  onActivate(event) {
    window.scroll(0, 0);
  }

  editData(id) {
    this.router.navigate(
      [
        "/Sidemenu/coaches/addcoaches/" +
          this.activatedRoute.snapshot.params.coachId
      ],
      { queryParams: { type: "EDIT" } }
    );
  }

  academySelected(academyId) {
    this.academyService.getAcademySports(academyId).subscribe(
      (data: any) => {
        this.sportsList = data.data;
        this.getAcademySpecificBatches(academyId);
        this.sportsList.sort(function(a, b) {
          if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1;
          }
          if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1;
          }
          return 0;
        });

        this.formData.sport = "";
        if (this.sportsList.length == 0) {
          this.toastr.error("No sports available for academy.");
        }
      },
      error => {}
    );
    /*this.coachService.getAcademyMaterCoaches(academyId).subscribe((data : any) =>{
  		this.chiefCoachesList = data.data;
  	},error =>{
  	});*/
  }
  getAcademySpecificBatches(id) {
    this.academyService.getAcademySpecificBatches(id).subscribe(
      (data: any) => {
        this.batchesList = data.data;
        this.batchesList.sort(function(a, b) {
          if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1;
          }
          if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1;
          }
          return 0;
        });
      },
      error => {}
    );
  }
  resetTime() {
    this.day = "";
    this.batch = "";
    this.start_time = "";
    this.end_time = "";
  }
  addTime() {
    if (
      this.day == "" ||
      this.start_time == "" ||
      this.end_time == "" ||
      this.batch == ""
    ) {
      this.toastr.error("Day, Start, End Time, Batch Should not be empty");
    } else {
      this.start_time = tConvert(this.start_time);
      this.end_time = tConvert(this.end_time);
      this.day.map(day => {
        let findData = this.timings.filter(time => {
          return time.day == day && time.batch == this.batch;
        });
        let findDuplicateData = this.timings.filter(time => {
          return (
            time.day == day &&
            time.batch == this.batch &&
            time.start_time == this.start_time &&
            time.end_time == this.end_time
          );
        });
        if (findData.length < 2 && !findDuplicateData.length) {
          // this.toastr.error('only 2 timings allowed per day and batch.');
          this.timings.push({
            day: day,
            start_time: this.start_time,
            end_time: this.end_time,
            batch: this.batch
          });
        } /*else{
    		}*/
      });
      this.resetTime();
    }
  }
  editTime(index) {
    this.currentTimeIndex = index;
    this.showAmenityEdit = true;
    this.day = this.timings[index].day;
    this.batch = this.timings[index].batch;
    this.start_time = this.timings[index].start_time;
    this.end_time = this.timings[index].end_time;
  }
  updateTime() {
    if (
      this.day == "" ||
      this.start_time == "" ||
      this.end_time == "" ||
      this.batch == ""
    ) {
      this.toastr.error("Day, start, end time, batch should not be empty");
    } else {
      let findData = this.timings.filter(time => {
        return time.day == this.day && time.batch == this.batch;
      });
      if (findData.length >= 2) {
        this.toastr.error("Only 2 timings allowed per day and batch.");
      } else {
        this.timings[this.currentTimeIndex].day = this.day;
        this.timings[this.currentTimeIndex].batch = this.batch;
        this.timings[this.currentTimeIndex].start_time = this.start_time;
        this.timings[this.currentTimeIndex].end_time = this.end_time;
        this.resetTime();
      }
    }
  }
  removeTime(index) {
    this.timings.splice(index, 1);
  }
  checkValue(checkValue) {
    if (!checkValue) {
      this.formData.chief_coach_id = "";
    }
  }
  addCoach() {
    if (this.formData.display_name && this.formData.display_name.length < 2) {
      this.toastr.error("Diplay name should have atleast 2 characters");
      return;
    }
   
    if (this.formData.certification && this.formData.certification.length < 3) {
      this.toastr.error("Certification name should have atleast 3 characters");
      return;
    }
    if (this.formData.aboutcoach && this.formData.aboutcoach.length < 20) {
      this.toastr.error("About coach should have atleast 20 characters");
      return;
    }
    if (!this.formData.name || !/\S/.test(this.formData.name)) {
      this.toastr.error("Coach name is a mandatory field.");
      return;
    }
    if (this.formData.name.length < 3) {
      this.toastr.error("Coach name should have atleast 3 characters");
      return;
    }
    if (!this.formData.gender) {
      this.toastr.error("Gender is a mandatory field.");
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
    if (!this.formData.email || !/\S/.test(this.formData.email)) {
      this.toastr.error("Email is a mandatory field.");
      return;
    }
    // else if(!/\S/.test(this.formData.email)){
    // 	this.toastr.error("Please enter valid email");
    // 	return;
    // }
    if (!this.commonService.validateEmail(this.formData.email)) {
      this.toastr.error(`Invalid e-mail address! Kindly recheck and re-enter the correct e-mail
      address.`);
      return;
    }

    if (
      this.formData.alternate_number &&
      !this.commonService.validateMobileNumber(this.formData.alternate_number)
    ) {
      this.toastr.error("Please enter valid alternate mobile number");
      return;
    }
    if (!this.date_of_birth) {
      this.toastr.error("Date of birth is a mandatory field.");
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
    if (!this.formData.batches) {
      this.toastr.error("Batch is a mandatory field.");
      return;
    }
    if (this.timings.length) {
      this.formData.timings = this.timings.map(time => {
        return {
          day: time.day.name,
          start_time: time.start_time,
          end_time: time.end_time,
          batch: time.batch.id
        };
      });
    }
    if (this.formData.batches.length) {
      this.formData.student_batch_list = [];
      this.formData.student_batch_name = [];
      this.formData.student_batch = this.formData.batches;
      this.formData.batches.forEach(item => {
        var currentBatch = this.batchesList.filter(batch => {
          return batch.id == item;
        })[0];
        this.formData.student_batch_list.push(currentBatch);
        this.formData.student_batch_name.push(currentBatch.name);
      });
    }
    this.userDetails = this.cookieService.getObject("loginResponce");
    this.formData.created_by = this.userDetails.id;
    if (this.date_of_birth) {
      this.formData.date_of_birth = convertDate(this.date_of_birth);
    }
    if (this.formData.chief_coach) {
      this.formData.chief_coach = "true";
    } else {
      this.formData.chief_coach = "false";
    }
    if (this.fileName) {
      this.masterDataService
        .uploadPic(this.formImageData)
        .subscribe((data: any) => {
          this.formData.profile_pic =
            data.data.result.files.profile_pic[0].providerResponse.location;
          this.coachService.saveCoach(this.formData).subscribe(
            (data: any) => {
              this.toastr.success("Coach created successfully.");
              this.checkIfSubmit = true;
              this.router.navigate(["/Sidemenu/coaches/coachList"]);
            },
            error => {
              this.toastr.error(error.error.error.message);
            }
          );
        });
    } else {
      this.coachService.saveCoach(this.formData).subscribe(
        (data: any) => {
          this.toastr.success("Coach created successfully.");
          this.checkIfSubmit = true;
          this.router.navigate(["/Sidemenu/coaches/coachList"]);
        },
        error => {
          this.toastr.error(error.error.error.message);
        }
      );
    }
  }
  updateCoach() {
    var tempDob;
    if (this.updateCoachDetails.display_name && this.updateCoachDetails.display_name.length < 2) {
      this.toastr.error("Diplay name should have atleast 2 characters");
      return;
    }
    if (this.updateCoachDetails.certification && this.updateCoachDetails.certification.length < 3) {
      this.toastr.error("Certification name should have atleast 3 characters");
      return;
    }
    if (this.updateCoachDetails.aboutcoach && this.updateCoachDetails.aboutcoach.length < 20) {
      this.toastr.error("About coach should have atleast 20 characters");
      return;
    }
    if (this.updateCoachDetails.batches.length === 0) {
      this.toastr.error("Batch is a mandatory field.");
      return;
    }
    if (!this.updateCoachDetails.name || !/\S/.test(this.updateCoachDetails.name)) {
      this.toastr.error("Coach name is a mandatory field.");
      return;
    }
    if (this.updateCoachDetails.name.length < 3) {
      this.toastr.error("Coach name should have atleast 3 characters");
      return;
    }
    if (this.updateCoachDetails.batches.length) {
      //this.updateCoachDetails.student_batch = this.updateCoachDetails.batches;
      this.updateCoachDetails.student_batch_list = [];
      this.updateCoachDetails.student_batch_name = [];
      this.updateCoachDetails.student_batch = this.updateCoachDetails.batches;
      this.updateCoachDetails.batches.forEach(item => {
        var currentBatch = this.batchesList.filter(batch => {
          return batch.id == item;
        })[0];
        this.updateCoachDetails.student_batch_list.push(currentBatch);
        this.updateCoachDetails.student_batch_name.push(currentBatch.name);
      });
    }
    if (
      this.updateCoachDetails.alternate_number &&
      !this.commonService.validateMobileNumber(
        this.updateCoachDetails.alternate_number
      )
    ) {
      this.toastr.error("Please enter valid alternate mobile number");
      return;
    }

    if (this.updateCoachDetails.date_of_birth) {
      tempDob = this.updateCoachDetails.date_of_birth;
      this.updateCoachDetails.date_of_birth = convertDate(
        this.updateCoachDetails.date_of_birth
      );
    }
    if (this.updateCoachDetails.chief_coach) {
      this.updateCoachDetails.chief_coach = "true";
    } else {
      this.updateCoachDetails.chief_coach = "false";
    }
    this.userDetails = this.cookieService.getObject("loginResponce");
    this.updateCoachDetails.updated_by = this.userDetails.id;
    this.updateCoachDetails.id = this.updateCoachDetails._id;
    //delete this.updateCoachDetails._id;
    if (this.fileName) {
      this.masterDataService
        .uploadPic(this.formImageData)
        .subscribe((data: any) => {
          this.updateCoachDetails.profile_pic =
            data.data.result.files.profile_pic[0].providerResponse.location;
          this.coachService.updateDetails(this.updateCoachDetails).subscribe(
            (data: any) => {
              this.toastr.success("Coach updated successfully.");
              this.checkIfSubmit = true;
              this.router.navigate(["/Sidemenu/coaches/coachList"]);
            },
            error => {
              this.updateCoachDetails.date_of_birth = tempDob;
              this.toastr.error(error.error.error.message);
            }
          );
        });
    }else{
		this.coachService.updateDetails(this.updateCoachDetails).subscribe(
			(data: any) => {
        this.toastr.success("Coach updated successfully.");
        this.checkIfSubmit = true;
			  this.router.navigate(["/Sidemenu/coaches/coachList"]);
			},
			error => {
			  this.updateCoachDetails.date_of_birth = tempDob;
			  this.toastr.error(error.error.error.message);
			}
		  );
	}
  }

  checkForDuplicateCoachesWithEmAilOrMobile(type, condition) {
    this.spinner.show();
    let data;
    if (type === "MOBILE") {
      data = {
        type: type,
        phone: condition
      };
    } else if (type === "EMAIL") {
      data = {
        type: type,
        email: condition
      };
    }
    this.coachService.checkForDuplicateCoachesWithEmAilOrMobile(data).subscribe(
      (data: any) => {
        if (data.data.status == 200) {
          if (data.data.data.length > 0) {
            if (type === "MOBILE") {
              this.toastr.error(
                "Coach already existed with this Mobile Number."
              );
            } else if (type === "EMAIL") {
              this.toastr.error("Coach already existed with this Email.");
            }
          }
          this.spinner.hide();
        }
      },
      error => {
        this.toastr.error(error.error.error.message);
        this.spinner.hide();
      }
    );
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  mobileNumberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (event.target.selectionStart === 0) {
      return (
        charCode === 54 || charCode === 55 || charCode === 56 || charCode === 57
      );
    } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }

  uploadProfilePic(event: any) {
    if (event.target.files && event.target.files[0]) {
      const fileDetails = event.target.files[0];
      this.fileName = fileDetails.name;
      this.formImageData.append("profile_pic", fileDetails);

      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.qImgLocalPath = (<FileReader>event.target).result;
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.fileName = "";
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
        this.updateCoachDetails.profile_pic = (<FileReader>event.target).result;
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
    this.formData.profile_pic = "";
    this.fileName = "";
    this.qImgLocalPath = "";
  }
  
  removeUpdateFile() {
    this.selectedFileElement.nativeElement.value = "";
    this.updateCoachDetails.profile_pic = '';
  }

  alphabets_dot_space_only(e){
    return this.validationsService.alphabets_dot_space_only(e);
  }
  alphabets_dot_space_number_only(e){
    return this.validationsService.alphabets_dot_space_number_only(e);
  }

}
function convertDate(inputFormat) {
  function pad(s) {
    return s < 10 ? "0" + s : s;
  }
  var d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("-");
}
function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
}

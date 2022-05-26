import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { AcademyService } from './../services/academy/academy.service';
import { CookieService } from 'angular2-cookie/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../apiUrls';
import { CoachService } from '../services/coach/coach.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

class academyData {
  slNo: number;
  // startTime: string;
  // endTime: string;
  sport: string;
  batch: string;
  size: string;
  fee: string
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-academies-sport-batches',
  templateUrl: './academies-sport-batches.component.html',
  styleUrls: ['./academies-sport-batches.component.css']
})
export class AcademiesSportBatchesComponent implements OnInit {
  userDetails: any;
  coachesList: any;

  constructor(
    private ascademyService: AcademyService,
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private coachService: CoachService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;

  ngOnInit() {
    this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      this.academyId = this.userDetails.id;
    }
    this.getSports();
    this.getAcademySpecificBatches();
    this.getAcademyStudentBatchesData();
    this.onActivate(event);
  }

  onActivate(event) {
    window.scroll(0, 0);
  }
  academyId: any;
  academySports: any = [];
  academyBatchData: any = { sport: '', coach: '', student_batch: '', start_time: '', end_time: '' };
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  batchTimings: any = { startTimeHours: "", startTimeMinutes: "", endTimeHours: "", endTimeMinutes: "" };
  getSports() {
    this.ascademyService.getAcademySports(this.academyId).subscribe((data: any) => {
      this.academySports = data.data;
    }, (err) => {

    })
  }
  batches: any = [];
  getAcademySpecificBatches() {
    this.ascademyService.getAcademySpecificBatches(this.academyId).subscribe((data: any) => {
      this.batches = data.data;
    }, (err) => {

    })
  }
  getCoaches() {
    this.coachService.getAcademySportCoaches(this.academyId, this.academyBatchData.sport).subscribe((data: any) => {
      this.coachesList = data.data;
      if (this.coachesList.length == 0) {
        this.toastr.error('No coaches available.')
      }
    }, error => {
      this.toastr.error(error.error.error.message);
    });
  }
  academyStudentBatches: any = [];
  getAcademyStudentBatchesData() {
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
            AppSettings.API_ENDPOINT + 'academies/getAcademyStudentBatches',
            Object.assign(dataTablesParameters, { academyId: this.academyId }), {}
          ).subscribe((resp: any) => {
            this.academyStudentBatches = resp.data.data;
            callback({
              recordsTotal: resp.data.recordsTotal,
              recordsFiltered: resp.data.recordsFiltered,
              data: []
            });
          });
      },
      columns: [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Sport', data: 'sport_name' },
        { title: 'Batch', data: 'student_batch_name' },
        // { title: 'Start Time', data: 'start_time' },
        // { title: 'End Time', data: 'end_time' },
        { title: 'Size', data: 'count' },
        { title: 'Fee', data: 'amount' },
        { title: 'Action', data: '', orderable: false }
      ]
    };
  }
  createAcademyBastch() {
    if (!this.academyBatchData.sport) {
      this.toastr.error('sport is required');
      return;
    }
    if (!this.academyBatchData.student_batch) {
      this.toastr.error('student_batch is required');
      return;
    }
    // if (!this.academyBatchData.start_time) {
    //   this.toastr.error('start_time is required');
    //   return;
    // }
    // if (!this.academyBatchData.end_time) {
    //   this.toastr.error('end_time is required');
    //   return;
    // }
    if (!this.academyBatchData.price) {
      this.toastr.error('fee is required');
      return;
    }
    //this.convertClockTimingsToSave(this.academyBatchData)
    this.academyBatchData.academy = this.userDetails.id;
    this.ascademyService.createAcademyStudentBatch(this.academyBatchData).subscribe((data: any) => {
      this.toastr.success('Sport batch created successfully');
      this.academyBatchData = { sport: '', student_batch: '', coach: '' };
      this.rerender();
    }, (err) => {
      this.toastr.error(err.error.error.message);
    })
  }
  currentSportBatch: any;
  openDeleteConfirmation(soprtBatch) {
    this.currentSportBatch = soprtBatch;
  }
  removeSportBatch() {
    this.ascademyService.deleteAcademyStudentBatch(this.currentSportBatch).subscribe((data: any) => {
      this.toastr.success('Sport batch deleted successfully');
      this.academyBatchData = { sport: '', student_batch: '', coach: '' };
      this.currentSportBatch = {};
      this.rerender();
    }, (err) => {
      this.toastr.error(err.error.error.message);
    });
  }
  sportBatchEdit = false;
  openEditBox(soprtBatch) {
    this.academyBatchData = JSON.parse(JSON.stringify(soprtBatch));
    //this.convertClockTimings(this.academyBatchData);
    this.academyBatchData.price = soprtBatch.amount;
    this.sportBatchEdit = true;
  }
  convertClockTimings(data) {
    if (data.start_time) {
      var startTimeArr = data.start_time.split(' ');

      if (startTimeArr[1] == "PM") {
        var startTimeHoursArr = startTimeArr[0].split(':');
        if (parseInt(startTimeHoursArr[0]) != 12) {
          data.start_time = `${parseInt(startTimeHoursArr[0]) + 12} : ${startTimeHoursArr[1]}`;
        } else {
          data.start_time = `${parseInt(startTimeHoursArr[0])} : ${startTimeHoursArr[1]}`;
        }
      } else {
        var startTimeHoursArr = startTimeArr[0].split(':');
        if (startTimeHoursArr[0] != 12) {
          data.start_time = startTimeArr[0];
        } else {
          data.start_time = `00:${startTimeHoursArr[1]}`;
        }
      }
    }
    if (data.end_time) {
      var end_timeArr = data.end_time.split(' ');
      if (end_timeArr[1] == "PM") {
        var endTimeHoursArr = end_timeArr[0].split(':');
        if (parseInt(endTimeHoursArr[0]) != 12) {
          data.end_time = `${parseInt(endTimeHoursArr[0]) + 12} : ${endTimeHoursArr[1]}`;
        } else {
          data.end_time = `${parseInt(endTimeHoursArr[0])} : ${endTimeHoursArr[1]}`;
        }
      } else {
        var endTimeHoursArr = end_timeArr[0].split(':');
        if (endTimeHoursArr[0] != 12) {
          data.end_time = end_timeArr[0];
        } else {
          data.end_time = `00:${endTimeHoursArr[1]}`;
        }
      }
    }
  }
  convertClockTimingsToSave(data) {
    if (data.start_time) {
      var startTimeHoursArr = data.start_time.split(':')
      if (parseInt(startTimeHoursArr[0]) < 12) {
        if (parseInt(startTimeHoursArr[0]) == 0) {
          data.start_time = `${parseInt(startTimeHoursArr[0]) + 12}:${startTimeHoursArr[1]} AM`;
        } else {
          data.start_time = `${parseInt(startTimeHoursArr[0])}:${startTimeHoursArr[1]} AM`;
        }
      } else if (parseInt(startTimeHoursArr[0]) == 12) {
        data.start_time = `${parseInt(startTimeHoursArr[0])}:${startTimeHoursArr[1]} PM`;
      } else {
        data.start_time = `${parseInt(startTimeHoursArr[0]) - 12}:${startTimeHoursArr[1]} PM`;
      }
    }
    if (data.end_time) {
      var endTimeHoursArr = data.end_time.split(':')
      if (parseInt(endTimeHoursArr[0]) < 12) {
        if (parseInt(endTimeHoursArr[0]) == 0) {
          data.end_time = `${parseInt(endTimeHoursArr[0]) + 12}:${endTimeHoursArr[1]} AM`;
        } else {
          data.end_time = `${parseInt(endTimeHoursArr[0])}:${endTimeHoursArr[1]} AM`;
        }
      } else if (parseInt(endTimeHoursArr[0]) == 12) {
        data.end_time = `${parseInt(endTimeHoursArr[0])}:${endTimeHoursArr[1]} PM`;
      } else {
        data.end_time = `${parseInt(endTimeHoursArr[0]) - 12}:${endTimeHoursArr[1]} PM`;
      }
    }
  }
  updateSportBatch() {
    if (!this.academyBatchData.sport) {
      this.toastr.error('sport is required');
      return;
    }
    if (!this.academyBatchData.student_batch) {
      this.toastr.error('student_batch is required');
      return;
    }
    // if (!this.academyBatchData.start_time) {
    //   this.toastr.error('start_time is required');
    //   return;
    // }
    // if (!this.academyBatchData.end_time) {
    //   this.toastr.error('end_time is required');
    //   return;
    // }
    if (!this.academyBatchData.price) {
      this.toastr.error('fee is required');
      return;
    }
    //this.convertClockTimingsToSave(this.academyBatchData)
    this.academyBatchData.academy = this.userDetails.id;
    this.ascademyService.updateAcademyStudentBatch(this.academyBatchData).subscribe((data: any) => {
      this.toastr.success('Sport batch updated successfully');
      this.academyBatchData = { sport: '', student_batch: '', coach: '' };
      this.rerender();
      this.closeAddExpenseModal.nativeElement.click();
    }, (err) => {

    })
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  onTabClose() {
    this.academyBatchData = { sport: '', student_batch: '', coach: '' };
    this.sportBatchEdit = false;
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  timingsListMasterArr = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]

  endTimingsArr = [];
  constructEndTimingsArr() {
    if (this.batchTimings.endTimeHours) {
      this.batchTimings.endTimeHours = "";
      this.batchTimings.endTimeMinutes = "";
    }
    this.endTimingsArr = this.timingsListMasterArr.filter((time) => {
      return time > this.batchTimings.startTimeHours
    })
  }

  currentBatchFee: any = {};
  currentBatchFeeTimings: any = [];
  getTimingsOfBatchFee() {
    this.spinner.show();
    this.ascademyService.getBatchTimingsByBatchFeeId({batchFeeId: this.currentBatchFee._id}).subscribe((data: any) => {
      if (data.data.status === 200) {
        this.spinner.hide();
        this.currentBatchFeeTimings = data.data.data;
      } else {
        this.spinner.hide();
        this.toastr.error(data.data.message)
      }
    })
  }

  storeCurrentBatchFee(batchFee) {
    this.currentBatchFee = { ...batchFee };
    this.getTimingsOfBatchFee();
  }

  deleteBatchTimingsById(id){
    this.ascademyService.deleteBatchTimingsById(id).subscribe((data: any) => {
      this.getTimingsOfBatchFee();
    })
  }

  closeBatchTimings() {
    this.currentBatchFee = {};
    this.batchTimings = { startTimeHours: "", startTimeMinutes: "", endTimeHours: "", endTimeMinutes: "" };
  }

  addBatchTimings() {
    if (!this.batchTimings.startTimeHours) {
      this.toastr.error("Please select start time Hours");
      return;
    }
    if (!this.batchTimings.startTimeMinutes) {
      this.toastr.error("Please select start time Minutes");
      return;
    }
    if (!this.batchTimings.endTimeHours) {
      this.toastr.error("Please select end time Hours");
      return;
    }
    if (!this.batchTimings.endTimeMinutes) {
      this.toastr.error("Please select end time Minutes");
      return;
    }
    this.spinner.show()
    this.batchTimings.batchFeeId = this.currentBatchFee._id;
    this.ascademyService.createAcademyStudentBatchTimings(this.batchTimings).subscribe((data: any) => {
      if (data.data.status === "SUCCESS") {
        this.toastr.success(data.data.message);
        this.batchTimings = { startTimeHours: "", startTimeMinutes: "", endTimeHours: "", endTimeMinutes: "" };
        this.getTimingsOfBatchFee();
      } else {
        this.spinner.hide();
        this.toastr.error(data.data.message);
      }
    }, (err) => {
      this.spinner.hide();
      this.toastr.error(err.error.error.message);
    })
  }

}

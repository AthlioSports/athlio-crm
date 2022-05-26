import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AcademyService } from './../../services/academy/academy.service';
import { CookieService } from 'angular2-cookie/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../apiUrls';
import { AppDateAdapter, APP_DATE_FORMATS } from './../../Utilities/date.datepicker';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatToolbarModule, MatTooltipModule } from "@angular/material";

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-create-discount',
  templateUrl: './create-discount.component.html',
  styleUrls: ['./create-discount.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class CreateDiscountComponent implements OnInit {

  constructor(
    private academyService: AcademyService,
    private cookieService: CookieService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private httpClient: HttpClient
  ) { }

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;

  userDetails: any = {};
  academyData: any = {};
  discountsList = [];
  isEditDiscount: boolean = false;
  ngOnInit() {
    this.userDetails = this.cookieService.getObject('loginResponce');
    this.academyData.academy = this.userDetails.id;
    this.dtOptions = this.getDtOptions()
    this.onActivate(event)
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

  studentsDiscount: any = { type: ""};
  studentsToAddDiscounts = [];
  selectedStudents = [];
  closeOnSelect = false;
  getStudentsToAddDiscounts() {
    if (!this.studentsDiscount.startDate) {
      this.toastrService.error("Select start date");
      return;
    }
    if (!this.studentsDiscount.endDate) {
      this.toastrService.error("Select end date");
      return;
    }
    debugger;
    if (!this.studentsDiscount.type) {
      this.toastrService.error("Select discount type");
      return;
    }
    if (!this.studentsDiscount.discount) {
      this.toastrService.error("Enter discount amount");
      this.studentsToAddDiscounts = [];
      this.selectedStudents = [];
      return;
    }
    if (this.studentsDiscount.type === "PERCENTAGE" && this.studentsDiscount.discount > 100) {
      this.toastrService.error("Discount should not be greater than 100%");
      this.studentsToAddDiscounts = [];
      this.selectedStudents = [];
      return;
    }
    this.selectedStudents = [];
    this.studentsDiscount.academy = this.userDetails.id;
    this.spinner.show()
    this.academyService.getStudentsToAddDiscounts(this.studentsDiscount).subscribe((data: any) => {
      if (data.data.status === 200) {
        this.studentsToAddDiscounts = [...data.data.data];
      }
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
      this.studentsToAddDiscounts = []
    })
  }

  cancelCreatingDiscounts() {
    this.studentsDiscount = {};
    this.selectedStudents = [];
    this.studentsToAddDiscounts = [];
    if (this.isEditDiscount) {
      this.isEditDiscount = false;
    }
  }

  addStudentsForDiscount(student) {
    if (!this.studentsDiscount.students) {
      this.studentsDiscount.students = [];
      this.studentsDiscount.students.push(student._id)
    } else {
      this.studentsDiscount.students.push(student._id)
    }
  }

  createDiscountsForStudents() {
    if (this.selectedStudents.length === 0) {
      this.toastrService.error("Please select atleast one student");
      return;
    }
    this.studentsDiscount.students = [];
    this.selectedStudents.forEach((student) => {
      this.studentsDiscount.students.push(student._id)
    });
    this.studentsDiscount.academy = this.userDetails.id;
    this.spinner.show();
    this.academyService.createDiscounts(this.studentsDiscount).subscribe((data: any) => {
      if (data.data.statusCode === 200) {
        this.toastrService.success("Discounts are added for the selected students.")
        this.studentsDiscount = {};
        this.selectedStudents = [];
        this.studentsToAddDiscounts = [];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
        this.spinner.hide();
        return;
      }
      this.toastrService.error(data.data.message);
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
    })
  }

  discountMinEndDate: Date;
  discountMinStartDate = new Date();
  setDiscountMinEndDate() {
    const date = new Date(new Date(this.studentsDiscount.startDate).getTime());
    this.discountMinEndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    if (!this.isEditDiscount) {
      this.studentsDiscount.endDate = "";
      this.studentsDiscount.type = "";
      this.studentsDiscount.discount = "";
    }
    if (this.studentsToAddDiscounts.length > 0) {
      this.selectedStudents = [];
      this.studentsToAddDiscounts = []
    }
  }

  resetStudentsToAddDiscounts() {
    this.studentsDiscount.type = "";
    this.studentsDiscount.discount = "";
    this.selectedStudents = [];
    this.studentsToAddDiscounts = []
  }

  resetDiscount() {
    this.studentsDiscount.discount = "";
    this.selectedStudents = [];
    this.studentsToAddDiscounts = []
  }

  getDtOptions() {
    return {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      retrieve: true,
      order: [[1, "asc"]],
      ajax: (dataTablesParameters: any, callback) => {
        this.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT + 'students_discounts/getListDt',
            Object.assign(dataTablesParameters, this.academyData), {}
          ).subscribe((resp: any) => {
            this.discountsList = resp.data.data;
            callback({
              recordsTotal: resp.data.recordsTotal,
              recordsFiltered: resp.data.recordsFiltered,
              data: []
            });
          });
      },
      columns: [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Name', data: 'studentName' },
        { title: 'From', data: 'startDate' },
        { title: 'To', data: 'endDate' },
        { title: 'Type', data: 'type' },
        { title: 'Discount', data: 'discount' },
        { title: 'Actions', data: '', orderable: false }
      ]
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  editDiscount(discount) {
    this.isEditDiscount = true;
    this.studentsDiscount = { ...discount };
    this.discountMinStartDate = new Date(this.studentsDiscount.startDate)
    this.setDiscountMinEndDate();
  }

  saveEditedDiscount() {
    if (!this.studentsDiscount.startDate) {
      this.toastrService.error("Select start date");
      return;
    }
    if (!this.studentsDiscount.endDate) {
      this.toastrService.error("Select end date");
      return;
    }
    if (!this.studentsDiscount.type) {
      this.toastrService.error("Select discount type");
      return;
    }
    if (!this.studentsDiscount.discount) {
      this.toastrService.error("Enter discount amount");
      return;
    }
    if (this.studentsDiscount.type === "PERCENTAGE" && this.studentsDiscount.discount > 100) {
      this.toastrService.error("Discount should not be greater than 100%");
      return;
    }
    this.spinner.show()
    this.academyService.editDiscount(this.studentsDiscount).subscribe((data: any) => {
      if (data.data.status === 200) {
        this.isEditDiscount = false;
        this.toastrService.success("Selected discount is edited successfully")
        this.studentsDiscount = {};
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
        this.spinner.hide();
        return;
      }
      this.toastrService.error(data.data.message)
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
    })
  }

  deleteDiscount() {
    this.spinner.show()
    this.academyService.deleteDiscount(this.currentDiscount).subscribe((data: any) => {
      if (data.data.status === 200) {
        this.isEditDiscount = false;
        this.toastrService.success("Selected discount is deleted successfully")
        this.closeDeleteModal();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
        this.spinner.hide();
        return;
      }
      this.toastrService.error(data.data.message);
      this.closeDeleteModal();
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
    })
  }

  currentDiscount: any = {};
  getDeleteConfirmation(discount) {
    this.currentDiscount = { ...discount };
  }

  closeDeleteModal() {
    this.currentDiscount = {}
    this.closeAddExpenseModal.nativeElement.click();
  }

}

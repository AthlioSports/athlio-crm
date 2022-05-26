import { Component, OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { ToastrService } from 'ngx-toastr';
import { AcademyService } from './../../services/academy/academy.service';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { AppSettings } from '../../apiUrls';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private academyService: AcademyService
  ) { }

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  userDetails: any = {};
  academyData: any = {};
  parentacademy:boolean =  false;
  notificationsList: any = [];

  ngOnInit() {
    this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      this.academyData.academy = this.userDetails.id
    } else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy') {
      this.parentacademy = true;
      this.academyData.parentAcademy = this.userDetails.id;
    }
    this.dtOptions = this.getDtOptions();
    this.onActivate(event);
  }

  getDtOptions(){
    return {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      retrieve: true,
      order: [[0, "asc"]],
      ajax: (dataTablesParameters: any, callback) => {
        this.httpClient
          .post(
            AppSettings.API_ENDPOINT + 'notifications/getPaymentNotificationsOfCRM',
            Object.assign(dataTablesParameters, this.academyData), {}
          ).subscribe((resp: any) => {
            this.notificationsList = resp.data.data;
            callback({
              recordsTotal: resp.data.recordsTotal,
              recordsFiltered: resp.data.recordsFiltered,
              data: []
            });
          });
      },
      columns: this.getColumnsData()
    };
  }

  getColumnsData() {
      return [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Date of payment', data: 'dop' },
        { title: 'Student', data: 'student' },
        { title: 'Sport - Batch', data: 'sport' },
        { title: 'Batch', data: 'batch' },
        { title: 'Academy', data: 'academy' },
        { title: 'Amount', data: 'amount' },
        { title: 'Mode of Payment', data: 'modeOfPayment' }
      ]
    }

    ngAfterViewInit(): void {
      this.dtTrigger.next();
    }
    ngOnDestroy(): void {
      // Do not forget to unsubscribe the event
      this.dtTrigger.unsubscribe();
    }

    onActivate(event) {
      window.scroll(0, 0);
    }

}

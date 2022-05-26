import { AfterViewInit, Component, Renderer, OnDestroy, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { AcademyService } from '../../services/academy/academy.service';
import { ToastrService } from 'ngx-toastr';
import { AppSettings } from '../../apiUrls';
import { Http, Response, RequestOptions } from '@angular/http';
import { Routes, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CookieService } from 'angular2-cookie/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private academyService: AcademyService,
    private router: Router, private toastr: ToastrService,
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService
  ) { }

  @ViewChild('closeAddExpenseModal2') closeAddExpenseModal2: ElementRef;
  @ViewChild('closeDeleteModel') closeDeleteModel: ElementRef;
  @ViewChild('closeRejectModel') closeRejectModel: ElementRef;
  @ViewChild('closeAcceptModel') closeAcceptModel: ElementRef;
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;

  videosList: any = [];
  dtOptions: DataTables.Settings[] = [];
  dtTrigger1: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  userDetails: any = {};
  academyLogin: boolean = false;
  parentAcademyLogin = false;
  tableColumns = [];

  ngOnInit() {
    this.userDetails = this.cookieService.getObject('loginResponce');
    this.dtOptions[0] = this.getPendingVideosDatatableOptions();
    this.dtOptions[1] = this.getApprovedRejectedVideosDatatableOptions();
  }

  getPendingVideosDatatableOptions() {
    return {

      pagingType: 'full_numbers',
      pageLength: 25,
      lengthMenu: [[-1, 5, 10, 25, 50, 100], ["ALL", 5, 10, 25, 50, 100]],
      serverSide: true,
      processing: true,
      retrieve: true,
      order: [[0, "asc"]],
      ajax: (dataTablesParameters: any, callback) => {
        this.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT + 'videos/getPendingVideosForApproval',
            Object.assign(dataTablesParameters), {}
          ).subscribe((resp: any) => {
            this.videosList = resp.data.data;
            this.videosList.map((video, i) => {
              video.slNo = i + 1;
            })
            callback({
              recordsTotal: resp.data.recordsTotal,
              recordsFiltered: resp.data.recordsFiltered,
              data: []
            });
          });
      },
      columns: [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Academy Name', data: 'academyName' },
        { title: 'Uploaded by', data: 'uploadedByName' },
        { title: 'Heading', data: 'heading' },
        { title: 'Uploaded on', data: '' },
        { title: 'Actions', data: '', orderable: false }
      ]
    };
  }
  approvedAndRejectedVideosList = [];
  getApprovedRejectedVideosDatatableOptions() {
    return {

      pagingType: 'full_numbers',
      pageLength: 25,
      lengthMenu: [[-1, 5, 10, 25, 50, 100], ["ALL", 5, 10, 25, 50, 100]],
      serverSide: true,
      processing: true,
      retrieve: true,
      order: [[0, "asc"]],
      ajax: (dataTablesParameters: any, callback) => {
        this.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT + 'videos/getApprovedAndRejectedVideos',
            Object.assign(dataTablesParameters), {}
          ).subscribe((resp: any) => {
            this.approvedAndRejectedVideosList = resp.data.data;
            this.approvedAndRejectedVideosList.map((video, i) => {
              video.slNo = i + 1;
            })
            callback({
              recordsTotal: resp.data.recordsTotal,
              recordsFiltered: resp.data.recordsFiltered,
              data: []
            });
          });
      },
      columns: [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Academy Name', data: 'academyName' },
        { title: 'Uploaded by', data: 'uploadedByName' },
        { title: 'Heading', data: 'heading' },
        { title: 'Approved / Rejected on', data: '' },
        { title: 'Status', data: 'status', orderable: false },
        { title: 'Delete', data: '', orderable: false }
      ]
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger1.next();
    this.dtTrigger2.next();
  }
  ngOnDestroy(): void {
    this.dtTrigger1.unsubscribe();
    this.dtTrigger2.unsubscribe();
  }
  currentVideo: any = {};
  viewVideo(video) {
    this.currentVideo = { ...video };
  }

  closeVideo() {
    this.currentVideo = {};
    this.closeAddExpenseModal2.nativeElement.click();
  }

  getVideoApproveConfirmation(video) {
    this.currentVideo = { ...video };
  }

  approveVideo() {
    this.spinner.show();
    this.academyService.approveVideo({ id: this.currentVideo._id }).subscribe((data: any) => {
      if (data.data.status === 200) {
        this.closeAcceptModel.nativeElement.click();
        this.currentVideo = {};
        setTimeout(() => {
          this.dtElements.map((item, i) => {
            item.dtInstance.then((dtInstance: DataTables.Api) => {
              this.spinner.hide();
              dtInstance.destroy();
              this[`dtTrigger${i + 1}`].next();
            });
          });
        }, 0);
        this.toastr.success(data.data.message);
        return;
      }
      this.spinner.hide();
      this.toastr.success(data.data.message);
      return;
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.error.message);
    });
  }

  rejectVideo() {
    this.spinner.show();
    this.academyService.rejectVideo({ id: this.currentVideo._id, reason: this.currentVideo.reason }).subscribe((data: any) => {
      if (data.data.status === 200) {
        this.closeRejectModel.nativeElement.click();
        this.currentVideo = {};
        setTimeout(() => {
          this.dtElements.map((item, i) => {
            item.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this[`dtTrigger${i + 1}`].next();
              this.spinner.hide();
            });
          });
        }, 0);
        this.toastr.success(data.data.message);
        return;
      }
      this.spinner.hide();
      this.toastr.success(data.data.message);
      return;
    }, error => {
      this.toastr.error(error.error.error.message);
      this.spinner.hide();
    });
  }

  getVideoRejectConfirmation(video) {
    this.currentVideo = { ...video };
  }

  getVideoDeleteConfirmation(video) {
    this.currentVideo = { ...video };
  }

  cancelApproveOrRejectOrDelete() {
    this.currentVideo = {};
    this.closeAcceptModel.nativeElement.click();
    this.closeRejectModel.nativeElement.click();
    this.closeDeleteModel.nativeElement.click();
  }

  deleteVideo() {
    this.spinner.show();
    this.academyService.deleteVideo({ id: this.currentVideo._id, role: "SUPER_ADMIN" }).subscribe((data: any) => {
      if (data.data.statusCode === 200) {
        this.closeDeleteModel.nativeElement.click();
        this.currentVideo = {};
        setTimeout(() => {
          this.dtElements.map((item, i) => {
            item.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this[`dtTrigger${i + 1}`].next();
              this.spinner.hide();
            });
          });
        }, 0);
        this.toastr.success(data.data.message);
        return;
      }
      this.spinner.hide();
      this.toastr.success(data.data.message);
      return;
    }, error => {
      this.toastr.error(error.error.error.message);
      this.spinner.hide();
    });
  }

}

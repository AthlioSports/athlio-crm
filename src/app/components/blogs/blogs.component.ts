import { AfterViewInit, Component, Renderer, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppSettings } from '../../apiUrls';
import { Http, Response, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { ExcelService } from './../../services/excel.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MasterDataService } from './../../services/master_data/master-data.service';

class blogData {
  slNo: number;
  blogname: string;
  author: string;
  category_type: string;
  sport_type: string;
  created_date: string;
  chackValue: boolean;
  status: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  blogsList: any = {};
  deleteId: string = '';
  constructor(
    private masterdataservice: MasterDataService,
    private router: Router,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private renderer: Renderer,
    private cookieService: CookieService,
    private excelService: ExcelService,
    private spinner: NgxSpinnerService
  ) { }
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;


  dtOptions: DataTables.Settings = {};
  userDetails: any = {};
  academyLogin: boolean = false;
  dtBlogsList: blogData[];
  dtTrigger: Subject<any> = new Subject();
  loginDetails: any = {};
  ngOnInit() {
    this.userDetails = this.cookieService.getObject('loginResponce');
    if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin') {
      this.academyLogin = true;
      this.loginDetails.academy = this.userDetails.id;
    }
    const that = this;
    this.dtOptions = {
      
      pagingType: 'full_numbers',
      pageLength: 25,
      serverSide: true,
      scrollY: "500px",
      processing: true,
      retrieve: true,
      order: [[ 1, "asc" ]],
      ajax: (dataTablesParameters: any, callback) => {
        that.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT + 'blogs/getBlogsListForCRM',
            Object.assign(dataTablesParameters, this.loginDetails), {}
          ).subscribe((resp: any) => {
            this.dtBlogsList = resp.data.data[0].blogsData
            callback({
              recordsTotal: resp.data.data[0].blogsData.length,
              recordsFiltered: resp.data.data[0].blogsCount.count,
              data: []
            });
          });
      },
      columns: [
        { title: 'S.No', data: 'slNo', orderable: false },
        { title: 'Blog Heading', data: 'heading' },
        { title: 'Author', data: 'author' },
        { title: 'Category Type', data: 'category' },
        { title: 'Sport Type', data: 'sport' },
        { title: 'Created Date', data: 'created_date' },
        { title: 'Actions', data: 'slNo', orderable: false }
       
      ]
    };

    this.onActivate(event);
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  selectedBlog: any;
  storeSelectedBlog(blogs){
    this.router.navigate(['/Sidemenu/blog-details'], { queryParams: { blogId: blogs._id, type: "VIEW" } });
    // this.selectedBlog = blogs;
  }

  editData(id) {
    this.router.navigate(['/Sidemenu/blog-details'], { queryParams: { blogId: id, type: "EDIT" } });
  }

  deleteBlog(id) {
    if (id) {
      this.masterdataservice.deleteBlog(id).subscribe((data: any) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next('page');
        });
        this.toastr.success('Blog removed successfully.');
      }, error => {
        this.toastr.error(error.error.error.message);
      });
    }
  }
}

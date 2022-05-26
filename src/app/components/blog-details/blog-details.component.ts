import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatIconRegistry } from "@angular/material";
import { MasterDataService } from "./../../services/master_data/master-data.service";
import { ToastrService } from "ngx-toastr";
import { Routes, ActivatedRoute, RouterModule, Router } from "@angular/router";
import { ValidationsService } from "./../../services/validations/validations.service";
import { FormCanDeactivate } from "../../form-can-deactivate/form-can-deactivate";
import { NgForm } from "@angular/forms";
import { CookieService } from 'angular2-cookie/core';
@Component({
  selector: "app-blog-details",
  templateUrl: "./blog-details.component.html",
  styleUrls: ["./blog-details.component.css"]
})
export class BlogDetailsComponent extends FormCanDeactivate implements OnInit {
  @ViewChild("aF") form: NgForm;

  name = "ng2-ckeditor";
  ckeConfig: any;
  mycontent: string;
  log: string = "";
  @ViewChild("myckeditor") ckeditor: any;
  @ViewChild("blogImage")
  selectedFileElement: ElementRef;
  blogData: any = {
    keyWords: []
  };
  checkIfSubmit: boolean = false;

  updateBlogDetails: any = {};
  disableUpdate: boolean = false;
  userDetails: any = {};
  academyLogin: boolean = false;
  constructor(
    private masterDataService: MasterDataService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private validationsService: ValidationsService,
    private cookieService: CookieService
  ) {
    super();
  }
  disableInputs: boolean = false;
  currentBlogId: any;
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.type === "EDIT") {
        this.disableInputs = false;
      } else if (params.type === "VIEW") {
        this.disableInputs = true;
      }
      this.userDetails = this.cookieService.getObject("loginResponce");
      if (
        this.userDetails &&
        this.userDetails.type &&
        this.userDetails.type.toLowerCase() == "academyadmin"
      ) {
        this.academyLogin = true;
      }
    });

    this.ckeConfig = {
      allowedContent: false,
      forcePasteAsPlainText: true
    };
    this.getSports();
    this.getBlogCategories();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.blogId) {
        this.currentBlogId = params.blogId;
        this.getBlogDetails();
      }
    });
    this.onActivate(event);
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  addKeyWord(event): void {
    const input = event.input;
    const value = event.value;
    // Add our keyword
    if ((value || "").trim()) {
      this.blogData.keyWords.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  editData() {
    debugger;
    this.router.navigate(["/Sidemenu/blog-details"], {
      queryParams: { blogId: this.currentBlogId, type: "EDIT" }
    });
  }

  removeKeyWord(keyWord): void {
    const index = this.blogData.keyWords.indexOf(keyWord);
    if (index >= 0) {
      this.blogData.keyWords.splice(index, 1);
    }
  }

  sportsData = [];
  getSports() {
    this.masterDataService.getSports().subscribe(
      (data: any) => {
        this.sportsData = data.data;
      },
      error => {}
    );
  }

  blogCategoriesData = [];
  getBlogCategories() {
    this.masterDataService.getBlogCategories().subscribe(
      (data: any) => {
        this.blogCategoriesData = data.data;
      },
      error => {}
    );
  }

  submitBlogData() {
    if (this.blogData.about && this.blogData.about.length < 20) {
      this.toastr.error("About blog should have atleast 20 characters.");
      return;
    }
    if (!this.blogData.heading) {
      this.toastr.error("Heading is a mandatory field.");
      return;
    }
    if (this.blogData.heading.length < 3) {
      this.toastr.error("Heading  should have atleast 3 characters");
      return;
    }
    if (!this.blogData.author) {
      this.toastr.error("Author is a mandatory field.");
      return;
    }
    if (this.blogData.author.length < 3) {
      this.toastr.error("Author  Name should have atleast 3 characters");
      return;
    }
    if (!this.blogData.category) {
      this.toastr.error("Category is a mandatory field.");
      return;
    }
    if (!this.blogData.sport) {
      this.toastr.error("Sport is a mandatory field.");
      return;
    }
    if (!this.blogData.about) {
      this.toastr.error("About is a mandatory field.");
      return;
    }
    if (this.blogData.about.length < 3) {
      this.toastr.error(" About should have atleast 3 characters");
      return;
    }
    if (!this.fileName) {
      this.toastr.error(`Looks like you haven’t uploaded an image yet! It is time to upload an image
      and complete this profile!`);
      return;
    }
    if (!this.blogData.content) {
      this.toastr.error("Content is a mandatory field.");
      return;
    }
    if (this.blogData.content.length < 3) {
      this.toastr.error(" Content should have atleast 3 characters");
      return;
    }
    if (this.blogData.keyWords.length === 0) {
      this.toastr.error("Keywords is a mandatory field.");
      return;
    } else {
      if(this.academyLogin){
        this.blogData.createdByRole = "ACADEMY"
      }else{
        this.blogData.createdByRole = "SUPER_ADMIN"
      }
      this.blogData.createdBy = this.userDetails.id;
      this.masterDataService
        .uploadPic(this.formImageData)
        .subscribe((data: any) => {
          const blogData: any = {
            ...this.blogData
          };
          blogData.blogImageName =
            data.data.result.files.blogImage[0].originalFilename;
          blogData.blogImage =
            data.data.result.files.blogImage[0].providerResponse.location;
          this.masterDataService.addBlog(blogData).subscribe(
            (data: any) => {
              this.fileName = "";
              this.selectedFileElement.nativeElement.value = "";
              this.formImageData = new FormData();
              this.blogData = {
                keyWords: [],
                content: ""
              };
              this.toastr.success("Blog posted successfully");
              this.checkIfSubmit = true;
              this.router.navigate(["/Sidemenu/blogs"]);
            },
            error => {
              this.toastr.error(error.error.error.message);
            }
          );
        });
    }
  }

  showCreateForm = true;
  formImageData: FormData = new FormData();
  fileName: any;
  uploadBlogImage(event: any) {
    const fileDetails = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      if (!this.showCreateForm) {
        this.fileName = event.target.files[0].name;
        this.formImageData.append("blogImage", event.target.files[0]);
      } else {
        this.fileName = event.target.files[0].name;
        this.formImageData.append("blogImage", event.target.files[0]);
      }
    } else {
      if (!this.showCreateForm) {
        this.formImageData = new FormData();
      } else {
        this.formImageData = new FormData();
      }
    }
  }

  hideImgUploadBtn = false;
  removeBlogImage() {
    if (this.currentBlogId && this.blogData.blogImageName) {
      this.blogData.blogImageName = "";
    } else {
      this.fileName = "";
      this.selectedFileElement.nativeElement.value = "";
      this.hideImgUploadBtn = false;
      this.formImageData = new FormData();
    }
  }

  // UpdateBlog(){
  //   this.masterDataService.updateBlogDetails(this.updateBlogDetails).subscribe((data: any) => {
  //     this.toastr.success('Blog updated successfully.');
  //     this.router.navigate(['/Sidemenu/blogs']);
  //     this.disableUpdate = false;
  //   }, error => {
  //     this.toastr.error(error.error.error.message);
  //     this.disableUpdate = false;
  //   });
  // };

  UpdateBlog() {
    if (!this.blogData.heading) {
      this.toastr.error("Heading is a mandatory field.");
      return;
    }
    if (this.blogData.heading.length < 3) {
      this.toastr.error(" Heading should have atleast 3 characters");
      return;
    }
    if (!this.blogData.author) {
      this.toastr.error("Author is a mandatory field.");
      return;
    }
    if (this.blogData.author.length < 3) {
      this.toastr.error(" Author should have atleast 3 characters");
      return;
    }
    if (!this.blogData.content) {
      this.toastr.error("Content is a mandatory field.");
      return;
    }
    if (this.blogData.content.length < 3) {
      this.toastr.error(" Content should have atleast 3 characters");
      return;
    }
    if (!this.blogData.category) {
      this.toastr.error("Category is a mandatory field.");
      return;
    }
    if (!this.blogData.about) {
      this.toastr.error("About is a mandatory field.");
      return;
    }
    if (this.blogData.about.length < 3) {
      this.toastr.error(" About should have atleast 3 characters");
      return;
    }
    if (!this.blogData.sport) {
      this.toastr.error("Sport is a mandatory field.");
      return;
    }
    if (!this.fileName && !this.blogData.blogImageName) {
      this.toastr.error(`Looks like you haven’t uploaded an image yet! It is time to upload an image
      and complete this profile!`);
      return;
    }
    if (this.blogData.keyWords.length === 0) {
      this.toastr.error("Keywords is a mandatory field.");
      return;
    } else {
      if (this.fileName) {
        this.masterDataService
          .uploadPic(this.formImageData)
          .subscribe((data: any) => {
            const blogData: any = {
              ...this.blogData
            };
            blogData.blogImageName =
              data.data.result.files.blogImage[0].originalFilename;
            blogData.blogImage =
              data.data.result.files.blogImage[0].providerResponse.location;
            this.masterDataService.updateBlogDetails(blogData).subscribe(
              (data: any) => {
                this.fileName = "";
                this.selectedFileElement.nativeElement.value = "";
                this.formImageData = new FormData();
                this.blogData = {
                  keyWords: [],
                  content: ""
                };
                this.toastr.success("Blog updated successfully.");
                this.checkIfSubmit = true;
                this.router.navigate(["/Sidemenu/blogs"]);
              },
              error => {
                this.toastr.error(error.error.error.message);
              }
            );
          });
      } else {
        const blogData: any = {
          ...this.blogData
        };
        this.masterDataService.updateBlogDetails(blogData).subscribe(
          (data: any) => {
            this.fileName = "";
            this.selectedFileElement.nativeElement.value = "";
            this.formImageData = new FormData();
            this.blogData = {
              keyWords: [],
              content: ""
            };
            this.toastr.success("Blog updated successfully.");
            this.checkIfSubmit = true;
            this.router.navigate(["/Sidemenu/blogs"]);
          },
          error => {
            this.toastr.error(error.error.error.message);
          }
        );
      }
    }
  }

  getBlogDetails() {
    this.masterDataService.getBlogDetails({ id: this.currentBlogId }).subscribe(
      (data: any) => {
        this.blogData = data.data.data[0].blogData;
      },
      error => {}
    );
  }

  alphabets_dot_space_only(e) {
    return this.validationsService.alphabets_dot_space_only(e);
  }
}

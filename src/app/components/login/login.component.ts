import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { LoginService } from "../../services/login/login.service";
import { ToastrService } from "ngx-toastr";
import { Routes, RouterModule, Router } from "@angular/router";
import { CookieService } from "angular2-cookie/core";
import { MasterDataService } from "../../services/master_data/master-data.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  parentAcademyLogin = false;
  ngOnInit() {
    if (this.cookieService.get("loginResponce")) {
      this.router.navigate(["/Sidemenu/dashboard"]);
      return;
    }
    // if (this.router.url === "/parentAcademy/Login") {
    //   this.otpLogin = true;
    //   this.parentAcademyLogin = true;
    // } else {
    if (this.router.url === "/Login") {
      this.otpLogin = true;
      this.loginRole = "ACADEMY";
      this.academyLogin = true;
    } else {
      this.otpLogin = false;
      this.superAdminLogin = true;
    }
    // }
  }
  loginResponse: any;
  loginRole: string;

  constructor(
    private cookieService: CookieService,
    public router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
    private masterDataService: MasterDataService
  ) {}

  @ViewChild("closeAddExpenseModal") closeAddExpenseModal: ElementRef;
  loginData: any = {};
  otpLogin: boolean = false;
  emailLogin: boolean = false;
  academyLogin = false;
  superAdminLogin: boolean = false;
  login() {
    this.loginService.login(this.loginData).subscribe(
      (data: any) => {
        if (data.data.status === 200) {
          this.toastr.success("Successfully logged in");
          this.loginResponse = data.data;
          this.cookieService.removeAll();
          this.cookieService.putObject("loginResponce", this.loginResponse);
          this.masterDataService.changeLoggedUser.next();
          this.router.navigate(["/Sidemenu/dashboard"]);
          return;
        }
        this.toastr.error(data.data.message);
      },
      error => {
        this.toastr.error(error.error.error.message);
      }
    );
  }

  otpSent = false;
  getAcademyOtp() {
    this.loginService.getAcademyOtp(this.loginData).subscribe(
      (data: any) => {
        this.toastr.success("OTP sent successfully.");
        this.loginData.otp = "";
        this.otpSent = true;
      },
      error => {
        this.toastr.error(error.error.error.message);
      }
    );
  }

  changeLoginRole() {
    if (this.loginRole === "ACADEMY") {
      this.academyLogin = true;
      this.parentAcademyLogin = false;
      this.loginData = {};
      this.otpSent = false;
    } else if (this.loginRole === "PARENT_ACADEMY") {
      this.academyLogin = false;
      this.parentAcademyLogin = true;
      this.loginData = {};
      this.otpSent = false;
    }
  }

  changeLoginType(type) {
    if (type === "email") {
      this.emailLogin = true;
      this.otpLogin = false;
      this.loginData = {};
    } else if (type === "otp") {
      this.emailLogin = false;
      this.otpLogin = true;
      this.loginData = {};
    }
  }
  loginWithOtp() {
    this.loginService.academyLogin(this.loginData).subscribe(
      (data: any) => {
        // if (data.data.status === 200) {
        this.toastr.success("Successfully logged in");
        this.loginResponse = data.data;
        this.cookieService.removeAll();
        this.cookieService.putObject("loginResponce", this.loginResponse);
        this.masterDataService.changeLoggedUser.next();
        this.router.navigate(["/Sidemenu/dashboard"]);
        // } else {
        //   this.toastr.error(data.data.message);
        // }
        /*this.token = this.loginResponse.jwtToken;
        this.loginService.finishAuthentication(this.token, this.loginResponse);
        */
      },
      error => {
        this.toastr.error(error.error.error.message);
      }
    );
  }

  forgotpassWord: any = {};
  forgotpassword() {
    this.loginService
      .ForgotPassword({ email: this.forgotpassWord.email })
      .subscribe((data: any) => {
        if (data.data.status === 200) {
          this.toastr.success(data.data.message);
          this.forgotpassWord.email = "";
          this.closeAddExpenseModal.nativeElement.click();
          return;
        }
        this.toastr.error(data.data.message);
      });
  }
  forgotParentpassword() {
    this.loginService
      .forgotParentpassword({ email: this.forgotpassWord.email })
      .subscribe((data: any) => {
        if (data.data.status === 200) {
          this.toastr.success(data.data.message);
          this.forgotpassWord.email = "";
          this.closeAddExpenseModal.nativeElement.click();
          return;
        }
        this.toastr.error(data.data.message);
      });
  }
  loginAcademyWithEmail() {
    this.loginService.academyLoginWithEmail(this.loginData).subscribe(
      (data: any) => {
        if (data.data.status === 200) {
          this.toastr.success("Successfully logged in");
          this.loginResponse = data.data;
          this.cookieService.removeAll();
          this.cookieService.putObject("loginResponce", this.loginResponse);
          this.masterDataService.changeLoggedUser.next();
          this.router.navigate(["/Sidemenu/dashboard"]);
          this.emailLogin = false;
          this.otpLogin = true;
          return;
        }
        this.toastr.error(data.data.message);
      },
      error => {
        this.toastr.error(error.error.error.message);
      }
    );
  }

  loginParentAcademyWithEmail() {
    this.loginService.academyParentLoginWithEmail(this.loginData).subscribe(
      (data: any) => {
        if (data.data.status === 200) {
          this.toastr.success("Successfully logged in");
          this.loginResponse = data.data;
          this.cookieService.removeAll();
          this.cookieService.putObject("loginResponce", this.loginResponse);
          this.masterDataService.changeLoggedUser.next();
          this.router.navigate(["/Sidemenu/dashboard"]);
          this.emailLogin = false;
          this.otpLogin = true;
          return;
        }
        this.toastr.error(data.data.message);
      },
      error => {
        this.toastr.error(error.error.error.message);
      }
    );
  }

  clearforgotpassword() {
    this.forgotpassWord.email = "";
  }

  getParentAcademyOtp() {
    this.loginService.getParentAcademyOtp(this.loginData).subscribe(
      (data: any) => {
        this.toastr.success("OTP sent successfully.");
        this.loginData.otp = "";
        this.otpSent = true;
      },
      error => {
        this.toastr.error(error.error.error.message);
      }
    );
  }

  loginParentWithOtp() {
    this.loginService.loginParentWithOtp(this.loginData).subscribe(
      (data: any) => {
        this.toastr.success("Successfully logged in");
        this.loginResponse = data.data;
        this.cookieService.removeAll();
        this.cookieService.putObject("loginResponce", this.loginResponse);
        this.masterDataService.changeLoggedUser.next();
        this.router.navigate(["/Sidemenu/dashboard"]);
      },
      error => {
        this.toastr.error(error.error.error.message);
      }
    );
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

  // changeLoginTypeToPassword(){
  //   this.otpLogin = false;
  // }
  // changeLoginTypeToOtp(){
  //   this.otpLogin = true;
  // }
}

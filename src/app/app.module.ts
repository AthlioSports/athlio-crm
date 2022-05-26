import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRadioModule } from "@angular/material";
import { MatSelectModule } from '@angular/material/select';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { MatToolbarModule, MatTooltipModule, } from '@angular/material';
import { CKEditorModule } from 'ng2-ckeditor';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserIdleModule } from 'angular-user-idle';
import { ConformationGuard } from './guards/conformation.guard';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatInputModule } from '@angular/material';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DataTableModule } from "angular-6-datatable";
import { DataTablesModule } from 'angular-datatables';
import { CookieService } from 'angular2-cookie/core';
import { NgxSpinnerModule } from "ngx-spinner";


import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { AcademiesComponent } from './components/academies/academies.component';

import { sportRouter } from './routes';
import { SubheaderComponent } from './components/subheader/subheader.component';
import { AcademiesListComponent } from './components/academies-list/academies-list.component';
import { AddCoachComponent } from './components/add-coach/add-coach.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CoachListComponent } from './components/coach-list/coach-list.component';
import { AddstudentComponent } from './components/addstudent/addstudent.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { SportsComponent } from './components/sports/sports.component';
import { CourtsComponent } from './components/courts/courts.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SampleComponent } from './components/sample/sample.component';

import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { BannersComponent } from './components/banners/banners.component';
import { OthersComponent } from './components/others/others.component';
import { OtherUploadListComponent } from './components/other-upload-list/other-upload-list.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SportBatchesComponent } from './components/sport-batches/sport-batches.component';
import { StudentFreeComponent } from './student-free/student-free.component';
import { AcademiesSportBatchesComponent } from './academies-sport-batches/academies-sport-batches.component';
import { StudentPaymentsHistoryComponent } from './components/student-payments-history/student-payments-history.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AboutComponent } from './about/about.component';
import { FeeReportByAcademyAndSportComponent } from './components/reports/fee-report-by-academy-and-sport/fee-report-by-academy-and-sport.component';
import { FeeReportByPaymentTypeComponent } from './components/reports/fee-report-by-payment-type/fee-report-by-payment-type.component';
import { StudentsReportComponent } from './components/reports/students-report/students-report.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { AmenitiesComponent } from './components/amenities/amenities.component';
import { CreateDiscountComponent } from './components/create-discount/create-discount.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ParentAcademyComponent } from './parent-academy/parent-academy.component';
import { CreateParentAcademyComponent } from './create-parent-academy/create-parent-academy.component';
import { DebounceClickDirective } from './debounce-click.directive';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { VideosComponent } from './components/videos/videos.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    FooterComponent,
    SidemenuComponent,
    AcademiesComponent,
    SubheaderComponent,
    AcademiesListComponent,
    AddCoachComponent,
    DashboardComponent,
    CoachListComponent,
    AddstudentComponent,
    StudentListComponent,
    SportsComponent,
    CourtsComponent,
    UserProfileComponent,
    SampleComponent,
    BannersComponent,
    OthersComponent,
    OtherUploadListComponent,
    SportBatchesComponent,
    StudentFreeComponent,
    AcademiesSportBatchesComponent,
    StudentPaymentsHistoryComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    AboutComponent,
    FeeReportByAcademyAndSportComponent,
    FeeReportByPaymentTypeComponent,
    StudentsReportComponent,
    BlogsComponent,
    BlogDetailsComponent,
    AmenitiesComponent,
    CreateDiscountComponent,
    ContactUsComponent,
    ParentAcademyComponent,
    CreateParentAcademyComponent,
    DebounceClickDirective,
    VideosComponent,
    NotificationsComponent,
  ],
  imports: [
    BrowserModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    sportRouter,
    AmazingTimePickerModule,
    NgSelectModule,
    DataTableModule,
    NgxSpinnerModule,
    MatToolbarModule,
    CKEditorModule,
    MatTooltipModule,
    ChartsModule,
    NgxChartsModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }), // ToastrModule added
    DataTablesModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyAcdenESpDJVD3v4kPYTD9rSpZqFG2spIk',
      libraries: ['places', 'geometry']
    }),
    UserIdleModule.forRoot({idle: 1200, timeout: 300, ping: 180})
  ],
  providers: [ConformationGuard,Title,
    { provide: CookieService, useFactory: cookieServiceFactory},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function cookieServiceFactory() {
  return new CookieService();
}
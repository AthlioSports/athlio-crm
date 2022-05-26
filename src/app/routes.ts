import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { SidemenuComponent } from './components/sidemenu/sidemenu.component';
import { AcademiesComponent } from './components/academies/academies.component';
import { SubheaderComponent } from './components/subheader/subheader.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AcademiesListComponent } from './components/academies-list/academies-list.component';
import { AddCoachComponent } from './components/add-coach/add-coach.component';
import { CoachListComponent } from './components/coach-list/coach-list.component';
import { AddstudentComponent } from './components/addstudent/addstudent.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { SportsComponent } from './components/sports/sports.component';
import { CourtsComponent } from './components/courts/courts.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SampleComponent } from './components/sample/sample.component';
import { BannersComponent } from './components/banners/banners.component';
import { OthersComponent } from './components/others/others.component';
import { AuthGuard } from './guards/auth.guard';
import { OtherUploadListComponent } from './components/other-upload-list/other-upload-list.component';
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
import { VideosComponent } from './components/videos/videos.component';
import { ConformationGuard } from './guards/conformation.guard';
import { NotificationsComponent } from './components/notifications/notifications.component';
export const routes: Routes = [
    { path: '', redirectTo: 'Login', pathMatch: 'full' },
    { path: 'Login', component: LoginComponent },
    { path: 'superAdmin/Login', component: LoginComponent },
    { path: 'subheader', component: SubheaderComponent },
    { path: 'sample', component: SampleComponent },
    { path: 'terms-and-coditions', component: TermsAndConditionsComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'about', component: AboutComponent },
    { path: 'parentAcademy/Login', component: LoginComponent },
    {
        path: 'Sidemenu', component: SidemenuComponent, canActivate: [AuthGuard], 

        children: [
            { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
            { path: 'academies/academiesList', component: AcademiesListComponent, canActivate: [AuthGuard] },
            { path: 'academies/addacademies', component: AcademiesComponent, canActivate: [AuthGuard], canDeactivate: [ConformationGuard] },
            { path: 'parent-academy/create-parentAcademy', component: CreateParentAcademyComponent, canActivate: [AuthGuard], canDeactivate: [ConformationGuard]},
            { path: 'parent-academy/create-parentAcademy/:academyId', component: CreateParentAcademyComponent, canActivate: [AuthGuard],canDeactivate: [ConformationGuard] },
            { path: 'parent-academy/parent-academy-list', component: ParentAcademyComponent, canActivate: [AuthGuard] },
            { path: 'parent-academy/parent-academy-list', component: ParentAcademyComponent, canActivate: [AuthGuard] },
            { path: 'academies/addacademies/:academyId', component: AcademiesComponent, canActivate: [AuthGuard],canDeactivate: [ConformationGuard] },
            { path: 'academies', redirectTo: 'academies/academiesList', pathMatch: 'full', canActivate: [AuthGuard] },
            { path: 'coaches/addcoaches', component: AddCoachComponent, canActivate: [AuthGuard], canDeactivate: [ConformationGuard] },
            { path: 'coaches/addcoaches/:coachId', component: AddCoachComponent, canActivate: [AuthGuard],canDeactivate: [ConformationGuard] },
            { path: 'coaches/coachList', component: CoachListComponent, canActivate: [AuthGuard] },
            { path: 'coaches', redirectTo: 'coaches/coachList', pathMatch: 'full', canActivate: [AuthGuard] },
            { path: 'coaches', redirectTo: 'coaches/coachList', pathMatch: 'full', canActivate: [AuthGuard] },
            { path: 'students/addstudent', component: AddstudentComponent, canActivate: [AuthGuard], canDeactivate: [ConformationGuard] },
            { path: 'students/addstudent/:studentId', component: AddstudentComponent, canActivate: [AuthGuard],canDeactivate: [ConformationGuard] },
            { path: 'students/studentList', component: StudentListComponent, canActivate: [AuthGuard] },
            { path: 'students', redirectTo: 'students/studentList', pathMatch: 'full', canActivate: [AuthGuard] },
            { path: 'sports', component: SportsComponent, canActivate: [AuthGuard] },
            { path: 'sport-batches', component: SportBatchesComponent, canActivate: [AuthGuard] },
            { path: 'academies-Sport-Batches', component: AcademiesSportBatchesComponent, canActivate: [AuthGuard] },
            { path: 'courts', component: CourtsComponent, canActivate: [AuthGuard] },
            { path: 'userProfile', component: UserProfileComponent, canActivate: [AuthGuard] },
            { path: 'banners', component: BannersComponent, canActivate: [AuthGuard] },
            { path: 'studentfree', component: StudentFreeComponent, canActivate: [AuthGuard] },
            { path: 'amenities', component: AmenitiesComponent, canActivate: [AuthGuard] },
            { path: 'others', redirectTo: 'others/othersList', pathMatch: 'full', canActivate: [AuthGuard] },
            { path: 'others/othersList', component: OtherUploadListComponent, canActivate: [AuthGuard] },
            { path: 'blogs', component: BlogsComponent, canActivate: [AuthGuard] },
            { path: 'videos', component: VideosComponent, canActivate: [AuthGuard] },
            { path: 'blog-details', component: BlogDetailsComponent, canActivate: [AuthGuard],canDeactivate: [ConformationGuard] },
            { path: 'others/createOthers', component: OthersComponent, canActivate: [AuthGuard], canDeactivate: [ConformationGuard] },
            { path: 'others/createOthers/:otherId', component: OthersComponent, canDeactivate: [ConformationGuard] },
            { path: 'studentfree/studentPaymentHistory', component: StudentPaymentsHistoryComponent, canActivate: [AuthGuard] },
            { path: 'reports/feeSummary', component: FeeReportByAcademyAndSportComponent, canActivate: [AuthGuard] },
            { path: 'reports/paymentSummary', component: FeeReportByPaymentTypeComponent, canActivate: [AuthGuard] },
            { path: 'reports/students', component: StudentsReportComponent,canActivate: [AuthGuard] },
            { path: 'discount/create-discount', component: CreateDiscountComponent, canActivate: [AuthGuard] },
            { path: 'contact-us', component: ContactUsComponent, canActivate: [AuthGuard] },
            { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },

        ]
    },
    { path: '**', redirectTo: 'Login', pathMatch: 'full' },
];
export const sportRouter: ModuleWithProviders = RouterModule.forRoot(routes);
import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { MaterialModule, MdDatepickerModule, MdNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CdkTableModule } from '@angular/cdk/table';

import { routing } from "./app.routes";

import 'hammerjs';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { PeriodComponent } from './home/period/period.component';
import { UserComponent} from './home/user/user.component';
import { EnrollmentComponent } from './home/enrollment/enrollment.component';
import { AchievementComponent } from './home/achievement/achievement.component';
import { MaintenanceComponent } from './home/maintenance/maintenance.component';
import { AlertComponent } from './alert/alert.component';
import { UserDetailComponent } from './home/user/detail/userdetail.component'
import { ScheduleComponent } from './home/period/schedule/schedule.component'
import { AchievementDetailComponent } from './home/achievement/detail/achievementdetail.component';
import { BccAchievementDetailComponent }from './home/achievement/detail/bccachievementdetail.component';
import {MaintenanceCourseParticipantComponent } from './home/maintenance/maintenancecourseparticipant.component';


import { AddUserDialog } from './home/user/adduserdialog.component';
import { EditAchievementDialog } from './home/achievement/editachievementdialog.component';
import { AddPeriodDialog } from './home/period/addperioddialog.component';

import { AuthGuard } from './service/authguard.service';
import { AuthenticationService } from './service/authentication.service';
import { AlertService } from './service/alert.service';
import { LoginService } from './service/login.service';
import { LocationService } from './service/location.service';
import { GradeService } from './service/grade.service';
import { EmployeeService } from './service/employee.service';
import { EmployeeMethod } from './service/employee.method';
import { RoleService } from './service/role.service';
import { PeriodService } from './service/period.service';
import { CoursenameService } from './service/coursename.service';
import { DownloadService } from './service/download.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { CourseService } from './service/course.service';
// used to create fake backend


import { HttpClientModule } from "@angular/common/http";
import { AddeligibleComponent } from './home/period/addeligible.component';
import { EnrollParticipantComponent } from './home/period/schedule/enroll.component'
import { DetailPeriodDialog } from './home/period/perioddetail.component' 
import { AddScheduleDialog } from './home/period/schedule/addschedule.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    PeriodComponent,
    AddPeriodDialog,
    UserComponent,
    EnrollmentComponent,
    AchievementComponent,
    MaintenanceComponent,
    AlertComponent,
    AddPeriodDialog,
    UserDetailComponent,
    AddUserDialog,
    AddeligibleComponent,
    ScheduleComponent,
    EnrollParticipantComponent,
    AchievementDetailComponent,
    DetailPeriodDialog,
    AddScheduleDialog,
    BccAchievementDetailComponent,
    EditAchievementDialog,
    MaintenanceCourseParticipantComponent 
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MdDatepickerModule,
    MdNativeDateModule,
    routing,
    HttpClientModule,
    CdkTableModule
  ],
  providers: [AuthGuard,
    AuthenticationService,
    AlertService,
    CookieService,
    LoginService,
    LocationService,
    EmployeeService,
    RoleService,
    EmployeeMethod,
    CoursenameService,
     GradeService,
    PeriodService,
    DownloadService,
    CourseService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddPeriodDialog,
    AddUserDialog,
    EditAchievementDialog,
    AddeligibleComponent,
    EnrollParticipantComponent,
    DetailPeriodDialog,
    AddScheduleDialog
  ]
})
export class AppModule { }

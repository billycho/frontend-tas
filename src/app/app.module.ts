import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { MaterialModule, MdDatepickerModule, MdNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing } from "./app.routes";

import 'hammerjs';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { PeriodComponent, AddPeriodDialog } from './home/period/period.component';
import { UserComponent} from './home/user/user.component';
import { EnrollmentComponent } from './home/enrollment/enrollment.component';
import { AchievementComponent } from './home/achievement/achievement.component';
import { MaintenanceComponent } from './home/maintenance/maintenance.component';
import { AlertComponent } from './alert.component';

import { AddUserDialog } from './home/user/adduserdialog.component';

import { AuthGuard } from './authguard.service';
import { AuthenticationService } from './authentication.service';
import { AlertService } from './alert.service';
import { LoginService } from './login.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { GradeService } from './home/user/grade.service';
import { EmployeeService } from './home/user/employee.service';
import { RoleService } from './home/user/role.service';
// used to create fake backend


import { HttpClientModule } from "@angular/common/http";
import { HelloComponent } from './hello/hello.component';

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
    HelloComponent,
    AddUserDialog
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
    HttpClientModule
  ],
  providers: [AuthGuard,
    AuthenticationService,
    AlertService,
    CookieService,
    LoginService,
    EmployeeService,
    RoleService,
    // providers used to create fake backend

    GradeService
   
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddPeriodDialog,
    AddUserDialog
  ]
})
export class AppModule { }

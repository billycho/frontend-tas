import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
import { DashboardComponent } from './home/dashboard/dashboard.component'
import { PeriodComponent } from './home/period/period.component'
import { UserComponent } from './home/user/user.component'
import { EnrollmentComponent } from './home/enrollment/enrollment.component'
import { AchievementComponent } from './home/achievement/achievement.component'
import { MaintenanceComponent } from "./home/maintenance/maintenance.component";
import { UserDetailComponent } from './home/user/detail/userdetail.component'
import { ScheduleComponent } from './home/period/schedule/schedule.component'
import { AchievementDetailComponent } from './home/achievement/detail/achievementdetail.component';
import { BccAchievementDetailComponent } from './home/achievement/detail/bccachievementdetail.component';
import {MaintenanceCourseParticipantComponent } from './home/maintenance/maintenancecourseparticipant.component';
import { AuthGuard } from './service/authguard.service';

const routes: Routes = [
    { path: 'login',            component: LoginComponent },
    { path: 'home',        component: HomeComponent, 
        children: [
            {path: '',              component: DashboardComponent},
          
            {path: 'period',        component: PeriodComponent,

        children :[
            {path:'schedule',           component: ScheduleComponent}
        ]},


            {path: 'period/:id', component: ScheduleComponent},
            {path: 'user',          component: UserComponent},
            {path: 'user/:id',          component: UserDetailComponent,
                    children: [
                    {path: 'achievement', component:AchievementDetailComponent},
                    {path: 'bcc', component:BccAchievementDetailComponent}
                ]
            },
            {path: 'enrollment',    component: EnrollmentComponent},
            {path: 'achievement',   component: AchievementComponent},
            {path: 'maintenance',   component: MaintenanceComponent},
            {path: 'maintenance/:courseid',   component: MaintenanceCourseParticipantComponent}
    ]},

    //if any path then redirect to home
    {path: '**', redirectTo:'home'}
];

export const routing = RouterModule.forRoot(routes);
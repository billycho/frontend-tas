import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
import { DashboardComponent } from './home/dashboard/dashboard.component'
import { PeriodComponent } from './home/period/period.component'
import { UserComponent } from './home/user/user.component'
import { EnrollmentComponent } from './home/enrollment/enrollment.component'
import { AchievementComponent } from './home/achievement/achievement.component'
import { MaintenanceComponent } from "./home/maintenance/maintenance.component";
import { UserDetailComponent } from './home/user/detail/userdetail.component';
import { AchievementDetailComponent } from './home/achievement/detail/achievementdetail.component';

import { AuthGuard } from './service/authguard.service';

const routes: Routes = [
    { path: 'login',            component: LoginComponent },
    { path: 'home',        component: HomeComponent, 
        canActivate: [AuthGuard],children: [
            {path: '',              component: DashboardComponent},
            {path: 'period',        component: PeriodComponent},
            {path: 'user',          component: UserComponent},
            {path: 'user/:id',          component: UserDetailComponent,
                    children: [{path: 'achievement', component:AchievementDetailComponent}]
            },
            {path: 'enrollment',    component: EnrollmentComponent},
            {path: 'achievement',   component: AchievementComponent},
            {path: 'maintenance',   component: MaintenanceComponent},
    ]},

    //if any path then redirect to home
    {path: '**', redirectTo:'home'}
];

export const routing = RouterModule.forRoot(routes);
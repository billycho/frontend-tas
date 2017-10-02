import { Component } from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';
import {MdSnackBar} from '@angular/material';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { Employee} from '../../../model/employee';
import { EmployeeMethod } from '../../../service/employee.method';
import { Role } from '../../../model/role';

import { EmployeeService } from '../../../service/employee.service';
import { RoleService } from '../../../service/role.service';
import { AlertService } from '../../../service/alert.service';

@Component({
    templateUrl: './schedule.component.html',
  })

export class ScheduleComponent {
    
    constructor(
        private route: ActivatedRoute,
        private alertService: AlertService,
        private alertSnackBar:MdSnackBar,
   
         
    ){
        this.route.params.subscribe((params: Params) => {
            let periodId = params['id'];
            console.log(periodId);
          });
    }
    
}
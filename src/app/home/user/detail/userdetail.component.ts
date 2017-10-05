import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import {MdSnackBar} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import {CookieService } from 'angular2-cookie/services/cookies.service';

import { Employee} from '../../../model/employee';
import { EmployeeMethod } from '../../../service/employee.method';
import { Role } from '../../../model/role';
import { LoginRequest} from '../../../model/loginrequest';

import { EmployeeService } from '../../../service/employee.service';
import { RoleService } from '../../../service/role.service';
import { AlertService } from '../../../service/alert.service';

@Component({
    templateUrl: './userdetail.component.html',
  })

export class UserDetailComponent {
    private tobeUpdatedEmployee:Employee;
    private roles:Role[];
    private idParam:number;
    private currentUser: LoginRequest;
    private loading:boolean = false;
    private selectedIndex=2;

    private editActive:boolean=false;
    private editRoles:boolean=false;

    constructor(
        private route: ActivatedRoute,
        private employeeService: EmployeeService,
        private roleService: RoleService,
        private alertService: AlertService,
        private alertSnackBar:MdSnackBar,
        private location: Location,
        private cookieService:CookieService,
         
    ){
        this.currentUser=JSON.parse(this.cookieService.get('currentUserLocalHost'));
        this.route.params.subscribe(params => {
            this.idParam= +params['id'];
            this.reload(this.idParam)
        });
        if(this.location.path() =="/home/user/"+this.idParam+"/achievement"){
            this.selectedIndex = 1;
        }else if(this.location.path() =="/home/user/"+this.idParam){
            this.selectedIndex = 0;
        }
    }
    reload(id:number){
        this.employeeService.getById(id).subscribe(
            employee =>{
                this.tobeUpdatedEmployee = employee;                    
                this.roleService.getAll().subscribe(
                    roles =>{
                        this.roles = roles;
                        // console.log(this.roles);
                    }
                );
                // console.log(this.tobeUpdatedEmployee);
            })
    }
    searchRole(employee:Employee,role:Role):boolean{
        var employeeMethod: EmployeeMethod = new EmployeeMethod(employee);
        return employeeMethod.searchRole(role) >=0;
    }

    toggleRole(employee:Employee,role:Role){
        var i:number=0;
        var employeeMethod: EmployeeMethod = new EmployeeMethod(employee);
        if (employeeMethod.searchRole(role) >= 0){
            employeeMethod.deleteRole(role);
        }else{
            employeeMethod.insertRole(role);
        }
    }

    updateUser(){
        this.loading=true;
        this.employeeService.update(this.tobeUpdatedEmployee)  
        .finally(()=>{
            this.reload(this.idParam);
            this.loading = false;
        })
        .subscribe(
            response =>{
                //var response = response;
                console.log(response);
                var msg:string;
                msg = response.fullname;
                if(response.active){
                    msg = msg + " (active) ";
                }else{
                    msg = msg + " (inactive) ";
                }

                if(response.roles.length > 0){
                    msg=msg+"has role(s) as: ";
                    var i:number;
                    for (i = 0 ; i < response.roles.length; i++){
                        msg = msg + response.roles[i].roleName;
                        if ( i < response.roles.length - 1){
                            msg = msg +", "
                        }
                    }
                }else{
                    msg = msg + "is now not TAS user";
                }
                this.alertService.success(msg);
            },

            error => {
                this.alertService.error(error);
            }
        )
        // .finally(()=>{
        //     console.log("finally");
            this.alertService.getMessage().subscribe(
            message=>{
                if(message !=null){
                    this.alertSnackBar.open(message.text,'', {
                        duration:3000
                    });
                }
            })
        // }) 
            
    }
    
    back(){
        this.location.back();
    }
}
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MdDialogRef } from '@angular/material';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MdSnackBar} from '@angular/material';
import 'rxjs/add/observable/of';

import { Employee } from '../../model/employee';
import { Role } from '../../model/role';

import { EmployeeService } from '../../service/employee.service';
import { RoleService } from '../../service/role.service';
import { AlertService } from '../../service/alert.service';

@Component({
    templateUrl: 'adduserdialog.component.html'
  })
  export class AddUserDialog {
    dataSource:EmployeeDataSource;
    loading: boolean = false;
    model: any;
    employees: Employee[];
    addEmployees:AddEmployee[]=[];
    dummy:string;

    constructor(
      private employeeService: EmployeeService,
      private roleService:RoleService,
      public dialogAddUser: MdDialogRef<AddUserDialog>,
      private alertService : AlertService,
      private alertSnackBar:MdSnackBar     
      ) {
        this.dummy ="true";
        this.employeeService.getEmployees()
            .subscribe(
                (employees)=>{this.employees=employees;
                var i:number;
                for(i = 0; i <employees.length; i++){
                    this.addEmployees[i] = new  AddEmployee(
                        this.employees[i]
                    );
                }
                this.dataSource = new EmployeeDataSource( this.addEmployees);
            })
        
      }
      displayedColumns = ['isUser','employeeId', 'fullname', 'jobfamily','stream', 'grade', 'active'];

    onNoClick(): void {
      this.closeDialog();
    }

    closeDialog(){
        this.dialogAddUser.close();
    }
    addUser(){
        var employeesAdded:number =0;
        var index:number=0;
        
        this.roleService.getRoleById(4).subscribe((fetchedRole) =>{
            let role = fetchedRole;
        
            while(index <this.addEmployees.length ) {
                if(!this.addEmployees[index].beenUser && this.addEmployees[index].isUser){
                    this.loading = true;
                    var resultEmployee: Employee;                    

                    this.employeeService.addUser(this.addEmployees[index].employee, role )
                    .subscribe(
                        employee => {
                            resultEmployee = employee;
                            this.alertService.success("Employee "+resultEmployee.fullname+" succesfully added.");
                            employeesAdded++;
                            this.closeDialog();
                        },
                        error => {
                            this.alertService.error(error);
                        });
                    }
                index++;
                } 
        });
        if (employeesAdded == 0){
            this.alertService.error("No employee to be added");            
        }

        this.alertService.getMessage().subscribe(
            message=>{
                if(message !=null){
                    this.alertSnackBar.open(message.text,'', {
                        duration:3000
                    });
                }
            }
        )
        this.loading = false;
    }
  }
  
export class EmployeeDataSource extends DataSource<any> {
    constructor( private addEmployees: AddEmployee[]){
        super();
    }
    connect(): Observable<AddEmployee[]> {
        return Observable.of(this.addEmployees);
    }

    disconnect() {}
    }

class AddEmployee{

    public beenUser:boolean;
    isUser:boolean;
    constructor(
        public employee:Employee
    ){
        this.beenUser=this.hadBeenUser();
        this.isUser = this.beenUser;
     }
     hadBeenUser():boolean{
        if(this.employee.roles.length > 0){
            return true;
        }else{
            return false;
        }
    }
    }
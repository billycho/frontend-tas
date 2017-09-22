import { Component } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MdDialogRef } from '@angular/material';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import 'rxjs/add/observable/of';

import { Employee } from './employee';

import { EmployeeService } from './employee.service';
import { AlertService } from '../../alert.service';

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
      public dialogRef: MdDialogRef<AddUserDialog>,
      private alertService : AlertService      
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
                console.log(this.addEmployees);
                // var i:number;
                // for(i = 0; i <employees.length; i++){
                    // this.addEmployee[i]= new AddEmployee(
                        // this.employees[i].employeeId,
                        // this.employees[i].fullname,
                        // this.employees[i].grade,
                        // this.employees[i].stream,
                        // this.employees[i].active, 
                        // this.employees[i].location,
                        // this.employees[i].accountName, 
                        // this.employees[i].email, 
                        // this.employees[i].accountPassword, 
                        // this.employees[i].salt, 
                        // this.employees[i].roles
                    // );
                // }
                this.dataSource = new EmployeeDataSource( this.addEmployees);
            })
        
      }
      displayedColumns = ['isUser','employeeId', 'fullname', 'jobfamily','stream', 'grade', 'active'];

    onNoClick(): void {
      this.closeDialog();
    }

    closeDialog(){
        this.dialogRef.close();
    }

    
    // addUser(){
    //     if(this.addEmployees.length > 0){
    //         this.loading = true;
    //         this.employeeService.addUser(this.model)
    //             .subscribe(
    //                 data => {
    //                     this.alertService.success('Registration successful', true);
    //                     this.closeDialog();
    //                 },
    //                 error => {
    //                     this.alertService.error(error);
    //                     this.loading = false;
    //                 });
    //         } else{
    //             this.alertService.error('No employee added');
    //         }
    // }
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
    //public isUser:boolean;
    public beenUser:boolean;
    public isUser:boolean;
    constructor(
        public employee:Employee
        // employeeId, 
        // fullname,
        // grade, 
        // stream, 
        // active, 
        // location, 
        // accountName, 
        // email, 
        // accountPassword, 
        // salt, 
        // roles
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
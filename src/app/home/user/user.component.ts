import { Component, OnInit, Inject} from '@angular/core';
import  {DataSource} from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MdDialog } from '@angular/material';

import 'rxjs/add/observable/of';

import { AddUserDialog } from './adduserdialog.component'
import { Employee } from './employee';

import { EmployeeService } from './employee.service';

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  private users:Employee[];
  dataSource:UserDataSource;

  constructor(
    private employeeService: EmployeeService,
    public addUserDialog: MdDialog
  ) {
    this.employeeService.getUsers()
      .subscribe(
        (users)=>{this.users = users; 
        this.dataSource = new UserDataSource( this.users);
        }
      );
  }
  
  displayedColumns = ['employeeId', 'fullname', 'email', 'jobfamily','stream', 'grade', 'accountName', 'active', 'roles', 'act'];
  
  ngOnInit() {
    
  }

  openDialog(): void {
    let dialogRef = this.addUserDialog.open(AddUserDialog, {
      height: '600px',
      width: '800px'
    });
  }
}

export class UserDataSource extends DataSource<any> {
  
  constructor(private users: Employee[]){
    super();
  }
  connect(): Observable<Employee[]> {
    return Observable.of(this.users);
  }

  disconnect() {}
}
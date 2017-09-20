import { Component, OnInit } from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { User } from './user';
// import {Grade} from './grade';

import { UserService } from './user.service';
// import { GradeService } from './grade.service';

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  private users:User[];
  dataSource:UserDataSource;
  // grades: Grade[];

  constructor(
    private userService: UserService
    // private gradeService:GradeService
  ) {
    this.userService.getUsers()
      .subscribe(
        (users)=>{this.users = users; 
        console.log(users[0].employeeId);
        this.dataSource = new UserDataSource( this.users);
        }
      );
      
    // this.dataSource = new UserDataSource( this.users);
    // this.gradeService.getUsers().subscribe((grades)=>{this.grades = grades; console.log(grades[0]);});
  }
  
  displayedColumns = ['employeeid', 'fullname', 'email', 'jobfam-stream', 'grade', 'accname', 'active', 'roles'];
  // dataSource = this.users;
  
  ngOnInit() {
    
  }
}

export class UserDataSource extends DataSource<any> {
  
  constructor(private users: User[]){
    super();
  }
  connect(): Observable<User[]> {
    console.log(this.users);
    return Observable.of(this.users);
  }

  disconnect() {}
}
import { Component, OnInit } from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { User } from './user';

import { UserService } from './user.service';

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[];
  constructor(private userService: UserService) {
    this.userService.getUsers().subscribe((users)=>{this.users = users; console.log(this.users);});
  }

  displayedColumns = ['employeeid', 'fullname', 'email', 'jobfam-stream', 'grade', 'accname', 'active', 'roles'];
  dataSource = this.users;

  ngOnInit() {
  }
}
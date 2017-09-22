import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import {CookieService } from 'angular2-cookie/services/cookies.service';

import { Employee } from './user/employee';

import { LoginRequest } from '../loginrequest';
import { EmployeeService } from './user/employee.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  
  private router: Router;
  private currentUser: LoginRequest;
  private user: Employee;
  private users: Employee[];
  
  constructor( private employeeService: EmployeeService,
    private authenticationService: AuthenticationService,
    private cookieService:CookieService
  ){
    //Using local storage:
    this.currentUser= JSON.parse(localStorage.getItem('currentUser'));

    //using cookie
    this.currentUser=JSON.parse(this.cookieService.get('currentUserLocalHost'));
   
  }
  logout(){
    this.authenticationService.logout();
  }
}

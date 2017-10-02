import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../service/authentication.service';
import {CookieService } from 'angular2-cookie/services/cookies.service';
import { EmployeeService } from '../service/employee.service';

import { Employee } from '../model/employee';
import { LoginRequest } from '../model/loginrequest';


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  
  private currentUser: LoginRequest;
  private user: Employee;
  private users: Employee[];
  
  constructor(  private route: ActivatedRoute,   private router: Router,private employeeService: EmployeeService,
    private authenticationService: AuthenticationService,
    private cookieService:CookieService
  ){
    //Using local storage:
       
    if (this.cookieService.get('currentUserLocalHost') == null) {
      this.router.navigate(['/login']);
    
    }
    else
    {
       this.currentUser=JSON.parse(this.cookieService.get('currentUserLocalHost'));  
  
    }
  }
  logout(){
    this.cookieService.remove('currentUserLocalHost');
    this.router.navigate(['/login']);
  }
}

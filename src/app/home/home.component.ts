import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import {CookieService } from 'angular2-cookie/services/cookies.service';

import { User } from '../user';

import { UserService } from '../user.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
  
  private router: Router;
  private currentUser: User;
  private user: User;
  private users: User[];
  
  constructor( private userService: UserService,
    private authenticationService: AuthenticationService,
    private cookieService:CookieService
  ){
    //Using local storage:
    // this.currentUser= JSON.parse(localStorage.getItem('currentUser'));

    //using cookie
    this.currentUser=JSON.parse(this.cookieService.get('currentUserLocalHost'));
  }
  logout(){
    this.authenticationService.logout();
  }
}

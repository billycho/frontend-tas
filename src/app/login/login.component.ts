import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService} from '../alert.service';
import { AuthenticationService } from '../authentication.service';
import { LoginService } from '../login.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    loginResponse;

    username: String;
    password: string;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private loginService: LoginService
        , private cookieService: CookieService,
        private alertService: AlertService
      ) { }

    ngOnInit() {
        // reset login status
        //this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    }

    login() {
        this.loading = true;

        var obj = { "username":this.username, "password":this.password};

        this.loginService.authenticate(obj).subscribe((loginResponse) => {this.loginResponse = loginResponse;
            alert(loginResponse.status);
            if(loginResponse.status == 1)
            {
               
                localStorage.setItem('currentUser', JSON.stringify(loginResponse));
                this.cookieService.put('currentUserLocalHost',JSON.stringify(loginResponse));
                this.router.navigate(['/home']);
              
            }
            else
            {
                this.alertService.error("Your username or password was incorrect");
                this.loading = false;
            }
        
        });
    
        // this.authenticationService.login(this.model.username, this.model.password)
        //     .subscribe(
        //         data => {
        //             this.router.navigate([this.returnUrl]);
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });
    }
}
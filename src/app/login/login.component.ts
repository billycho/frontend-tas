import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService} from '../service/alert.service';
import { AuthenticationService } from '../service/authentication.service';
import { LoginService } from '../service/login.service';
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

    username: string;
    password: string;
    remember: boolean;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private loginService: LoginService
        , private cookieService: CookieService,
        private alertService: AlertService
      ) { }

    ngOnInit() {
        this.remember = false;
        
        if(this.cookieService.get('rememberMe') == null)
        {
           
        }
        else
        {
            if(this.cookieService.get('rememberMe') == "true")
            {
                this.password = this.cookieService.get('password');
                this.username = this.cookieService.get('username'); 
            };
        }

        // reset login status
        //this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    }

    changeRemember()
    {
        if(this.remember == false)
        {
            this.remember = true;
        }
        else
        {
            this.remember = false;
        }
        
    }

    login() {
        this.loading = true;

        var obj = { "username":this.username, "password":this.password};

        this.loginService.authenticate(obj).subscribe((loginResponse) => {this.loginResponse = loginResponse;
            //alert(loginResponse.status);
            if(loginResponse.status == 1)
            {
                if(this.remember == true)
                {
                    this.cookieService.put('rememberMe',"true");
                    this.cookieService.put('password', this.password);
                    this.cookieService.put('username', this.username);
                    //alert(this.cookieService.get('rememberMe'));
                }
                else
                {
                    this.cookieService.put('rememberMe',"false");
                    this.cookieService.put('password', "");
                    this.cookieService.put('username', "");
                }

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
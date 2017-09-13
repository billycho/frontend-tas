import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    constructor(private http: Http, private cookieService: CookieService) { }

    login(username: string, password: string) {
        return this.http.post('/api/authenticate', JSON.stringify({ username: username, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    
                    //Using local storage:
                    // localStorage.setItem('currentUser', JSON.stringify(user));

                    //Using cookie:
                    this.cookieService.put('currentUserLocalHost',JSON.stringify(user));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        //localStorage.removeItem('currentUser');

        //Using cookie:
        this.cookieService.remove('currentUserLocalHost');
    }
}
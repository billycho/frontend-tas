import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import {CookieService} from 'angular2-cookie/services/cookies.service';

import { User } from './user';

@Injectable()
export class UserService {
    constructor(private http: Http,
         private cookieService: CookieService
        ) { }

    getAll() {
        return this.http.get('/api/users', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token

        //Using local storage
        // let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        //Using cookie
        let currentUser = JSON.parse(this.cookieService.get('currentUserLocalHost'));

        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}
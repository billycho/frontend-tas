import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions ,Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { LoginRequest } from '../../loginrequest';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { User } from './user';

@Injectable()
export class UserService {
   constructor(private http: Http) {
   }
 
   getUsers(): Observable<User[]> {
      
      return this.http.get("http://localhost:8080/employees")
         .map((res: Response) => res.json())
         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }
}
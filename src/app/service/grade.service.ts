import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions ,Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { LoginRequest } from '../model/loginrequest';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { Grade } from '../model/grade';
@Injectable()
export class GradeService {
   constructor(private http: Http) {
   }
 
   getUsers(): Observable<Grade[]> {
      
      return this.http.get("http://localhost:8085/grades")
         .map((res: Response) => res.json())
         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }
}
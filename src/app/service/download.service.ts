import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions ,Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { LoginRequest } from '../model/loginrequest';
import { CookieService } from 'angular2-cookie/services/cookies.service';

@Injectable()
export class DownloadService {
   constructor(private http: Http) {
   }
 
   getAchievementExcel() {
       console.log('bbb');
      return this.http.get("http://localhost:8080/downloads/achievement")
      .map((res:Response)=>{
            return res.json();
        })
        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }
}
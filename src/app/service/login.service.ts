import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions ,Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Location } from "../model/location";
import { LoginRequest } from '../model/loginrequest';
import { CookieService } from 'angular2-cookie/services/cookies.service';

@Injectable()
export class LoginService {

  constructor(private http: Http, private cookieService: CookieService) { }

  authenticate (obj: Object): Observable<LoginRequest> {
    let bodyString = JSON.stringify(obj); // Stringify payload
    let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options       = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post("http://localhost:8080/create", obj, options) // ...using post request
                     .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                     .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
}   
}

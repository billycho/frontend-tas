import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions ,Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Coursename } from '../model/coursename';
@Injectable()
export class CoursenameService{
    constructor(private http: Http) {
    }

    getCoursenameById(id:number):Observable<Coursename>{
        return this.http.get("http://localhost:8080/coursenames/"+id)
           .map((res:Response)=>res.json())
           .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getCoursenames():Observable<Coursename[]>{
        return this.http.get("http://localhost:8080/coursenames")
           .map((res:Response)=>res.json())
           .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getBCCCoursenames():Observable<Coursename[]>{
        return this.http.get("http://localhost:8080/coursenames/bcc")
        .map((res:Response)=>res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}
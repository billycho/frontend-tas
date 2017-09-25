import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions ,Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Role } from './role';

@Injectable()
export class RoleService {
   constructor(private http: Http) {
   }
   
   getRoleById(id:number): Observable<Role> {
      return this.http.get("http://localhost:8080/roles/"+id)
         .map((res: Response) => res.json())
         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }
}
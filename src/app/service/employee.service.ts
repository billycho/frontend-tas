import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions ,Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { LoginRequest } from '../model/loginrequest';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { Employee } from '../model/employee';
import { Role } from '../model/role';

@Injectable()
export class EmployeeService {
   constructor(private http: Http) {
   }
   
   getEmployees(): Observable<Employee []> {
      
      return this.http.get("http://localhost:8080/employees")
         .map((res: Response) => res.json())
         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }

   getUsers(): Observable<Employee []> {
      
      return this.http.get("http://localhost:8080/employees/users")
         .map((res: Response) => res.json())
         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }

   addUser(employee: Employee, role: Role): Observable<Employee>{
         var obj = {"employeeId":employee.employeeId, "roleId":role.roleId};
         console.log(JSON.stringify({employeeId:employee.employeeId, roleId:role.roleId}));
         return this.http.post("http://localhost:8080/employees/addrole",obj)
         .map((res: Response) => res.json())
         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }
}

class EmployeeRole{
      constructor(
            employeeId:number,
            roleId:number
      ){ }
}
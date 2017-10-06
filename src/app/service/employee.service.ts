import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions ,Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { LoginRequest } from '../model/loginrequest';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { Employee } from '../model/employee';
import { Role } from '../model/role';
import { Course } from '../model/course';
import {CourseParticipant} from '../model/courseparticipant';

@Injectable()
export class EmployeeService {
   constructor(private http: Http) {
   }
   
   getEmployees(): Observable<Employee []> {
      
      return this.http.get("http://localhost:8085/employees")
         .map((res: Response) => res.json())
         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }

   getUsers(): Observable<Employee []> {
      
      return this.http.get("http://localhost:8085/employees/users")
         .map((res: Response) => res.json())
         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }

   addUser(employee: Employee, role: Role): Observable<Employee>{
         var obj = {"employeeId":employee.employeeId, "roleId":role.roleId};
      //    console.log(JSON.stringify({employeeId:employee.employeeId, roleId:role.roleId}));
         return this.http.post("http://localhost:8085/employees/addrole",obj)
         .map((res: Response) => res.json())
         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }

   getById(id:number):Observable<Employee>{
         return this.http.get("http://localhost:8085/employees/"+id)
            .map((res:Response)=>res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }
   
   //RESTRICTED TO ONLY UPDATE ROLE AND ACTIVE
   update(employee: Employee):Observable<Employee>{
      var obj = {"employeeId":employee.employeeId, "active":employee.active, "roles":employee.roles};
      return this.http.post("http://localhost:8085/employees/update",obj)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }
   getAllCoursesOfAnEmployee(id:number):Observable<CourseParticipant[]>{
      return this.http.get("http://localhost:8085/employees/"+id+"/courses")
      .map((res:Response)=>{
            return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }
   getEmployeeBCC(id:number):Observable<CourseParticipant[]>{
      return this.http.get("http://localhost:8085/employees/"+id+"/courses/bcc")
      .map((res:Response)=>{
            return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }

   getCoursesByCouseNameId(id:number, coursenameid:number):Observable<CourseParticipant[]>{
      // console.log("http://localhost:8085/employees/"+id+"/courses/"+coursenameid);
      return this.http.get("http://localhost:8085/employees/"+id+"/courses/"+coursenameid)
      .map((res:Response)=>{
            return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }

   getEnrolledCourse(id:number):Observable<Course[]>
   {
       console.log("http://localhost:8085/employees/"+id+"/enrolled");
       return this.http.get("http://localhost:8085/employees/"+id+"/enrolled")
       .map((res:Response)=>{
             return res.json();
       })
       .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }

   getEnrolledStatusCourse(id:number):Observable<any[]>
   {
       console.log("http://localhost:8085/employees/"+id+"/enrolledstatus");
       return this.http.get("http://localhost:8085/employees/"+id+"/enrolledstatus")
       .map((res:Response)=>{
             return res.json();
       })
       .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }

   getTrainer():Observable<Employee[]>
   {
      console.log("http://localhost:8085/roles/3/employees");
      return this.http.get("http://localhost:8085/roles/3/employees")
      .map((res:Response)=>{
            return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }

   getRooms():Observable<any[]>
   {
      console.log("http://localhost:8085/rooms");
      return this.http.get("http://localhost:8085/rooms")
      .map((res:Response)=>{
            return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }
   updateAchievement(courseParticipant:CourseParticipant[]):Observable<CourseParticipant[]>{
      return this.http.post("http://localhost:8085/employees/update/achievement", courseParticipant)
      .map((res:Response)=>{
            return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }
}
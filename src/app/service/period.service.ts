import { Injectable } from '@angular/core';
import { TrainingPeriod } from '../model/trainingperiod';
import { Observable } from 'rxjs/Rx';
import { Http, Response, RequestOptions ,Headers } from '@angular/http';
import { LoginRequest } from '../model/loginrequest';
import {CookieService } from 'angular2-cookie/services/cookies.service';

@Injectable()
export class PeriodService {
  private currentUser: LoginRequest;
  constructor(private http: Http,
    private cookieService:CookieService) { 
    
  }

  getTrainingPeriods(): Observable<TrainingPeriod []> {
    
    return this.http.get("http://localhost:8080/periods")
       .map((res: Response) => res.json())
       .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
 }
 
 
 editTrainingPeriod(period:TrainingPeriod): Observable<TrainingPeriod>
 {
  
  this.currentUser=JSON.parse(this.cookieService.get('currentUserLocalHost'));  
  
  var obj = {"trainingPeriodId": period.trainingPeriodId, "periodName": period.periodName, "startDate":period.startDate.toLocaleDateString(), "endDate":period.endDate.toLocaleDateString(),"creatorId": this.currentUser.employeeId,"createdDate":period.createdDate.toLocaleDateString(), "updaterId":this.currentUser.employeeId, 
   "updateDate":period.updatedDate.toLocaleDateString(), "periodical":period.periodical, "openenrollment":period.openenrollment};
   console.log(JSON.stringify(obj));
     return this.http.post("http://localhost:8080/periods/edit",obj)
  .map((res: Response) => res.json())
  .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
 }
 addTrainingPeriod(period:TrainingPeriod): Observable<TrainingPeriod>
 {
  
  this.currentUser=JSON.parse(this.cookieService.get('currentUserLocalHost'));  
  console.log(period.startDate.toLocaleDateString());
  
  var obj = {"periodName": period.periodName, "startDate":period.startDate.toLocaleDateString(), "endDate":period.endDate.toLocaleDateString(),"creatorId": this.currentUser.employeeId,"createdDate":period.createdDate.toLocaleDateString(), "updaterId":this.currentUser.employeeId, 
   "updateDate":period.updatedDate, "periodical":period.periodical, "openenrollment":period.openenrollment};
   console.log(JSON.stringify(obj));
     return this.http.post("http://localhost:8080/periods/add",obj)
  .map((res: Response) => res.json())
  .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
    

//  addUser(employee: Employee, role: Role): Observable<Employee>{
//   var obj = {"employeeId":employee.employeeId, "roleId":role.roleId};
//   console.log(JSON.stringify({employeeId:employee.employeeId, roleId:role.roleId}));
//   return this.http.post("http://localhost:8080/employees/addrole",obj)
//   .map((res: Response) => res.json())
//   .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
// }



}
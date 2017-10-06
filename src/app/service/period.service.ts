import { Injectable } from '@angular/core';
import { TrainingPeriod } from '../model/trainingperiod';
import { Employee } from '../model/employee';
import { EligibleParticipant } from '../model/eligible'
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
    
    return this.http.get("http://localhost:8085/periods")
       .map((res: Response) => res.json())
       .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
 }
 
 
 editTrainingPeriod(period:TrainingPeriod): Observable<TrainingPeriod>
 {
  
  this.currentUser=JSON.parse(this.cookieService.get('currentUserLocalHost'));  
  
  var obj = {"trainingPeriodId": period.trainingPeriodId, "periodName": period.periodName, "startDate":period.startDate.toLocaleDateString(), "endDate":period.endDate.toLocaleDateString(),"creatorId": this.currentUser.employeeId,"createdDate":period.createdDate.toLocaleDateString(), "updaterId":this.currentUser.employeeId, 
   "updateDate":period.updatedDate.toLocaleDateString(), "periodical":period.periodical, "openenrollment":period.openenrollment};
   console.log(JSON.stringify(obj));
     return this.http.post("http://localhost:8085/periods/edit",obj)
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
     return this.http.post("http://localhost:8085/periods/add",obj)
  .map((res: Response) => res.json())
  .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getEmployeeByPeriod(trainingId: number) : Observable<Employee[]>
  {
    console.log("http://localhost:8085/periods/" + trainingId + "/employee");
    return this.http.get("http://localhost:8085/periods/" + trainingId + "/employee")
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  addEligibleParticipant(eligible: EligibleParticipant) : Observable<EligibleParticipant>
  {
    var obj = {"trainingPeriodId": eligible.trainingPeriodId, "employeeId": eligible.employeeId};
    console.log(JSON.stringify(obj));
 
    return this.http.post("http://localhost:8085/periods/"+eligible.trainingPeriodId+"/addemployee",obj)
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteEligibleParticipant(eligible: EligibleParticipant) : Observable<number>
  {
    var obj = {"trainingPeriodId": eligible.trainingPeriodId, "employeeId": eligible.employeeId};
    console.log(JSON.stringify(obj));
 
    return this.http.post("http://localhost:8085/periods/"+eligible.trainingPeriodId+"/deleteemployee",obj)
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }


  getScheduleByPeriod(trainingId: number) : Observable<any[]>
  { //courses/46/period
    console.log("http://localhost:8085/courses/" + trainingId + "/period");
    return this.http.get("http://localhost:8085/courses/" + trainingId + "/period")
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getParticipantByCourse(courseId: number) : Observable<Employee[]>
  {
    console.log("http://localhost:8085/courses/" + courseId + "/participants");
    return this.http.get("http://localhost:8085/courses/" + courseId + "/participants")
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  
  addEnrolledParticipant(eligible: EligibleParticipant) : Observable<EligibleParticipant>
  {
    var obj = {"courseId": eligible.trainingPeriodId, "employeeId": eligible.employeeId,"pass":false};
    console.log(JSON.stringify(obj));

    return this.http.post("http://localhost:8085/courses/"+eligible.trainingPeriodId+"/addparticipant",obj)
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deleteEnrolledParticipant(eligible: EligibleParticipant) : Observable<number>
  {
    var obj = {"courseId": eligible.trainingPeriodId, "employeeId": eligible.employeeId};
    console.log(JSON.stringify(obj));
 
    return this.http.post("http://localhost:8085/courses/"+eligible.trainingPeriodId+"/deleteparticipant",obj)
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getCourseName():Observable<any[]>
  {
     console.log("http://localhost:8085/coursenames");
     return this.http.get("http://localhost:8085/coursenames")
     .map((res:Response)=>{
           return res.json();
     })
     .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  addCourseSchedule(obj:any,trainingId:number) : Observable<any> {
    console.log(JSON.stringify(obj));
    console.log("http://localhost:8085/courses/" + trainingId + "/addschedule");
    return this.http.post("http://localhost:8085/courses/" + trainingId + "/addschedule", obj)
    .map((res:Response)=>{
          return res.json();
    })
  }

  getPeriodById(obj:number) : any
  {
    console.log("http://localhost:8085/coursenames");
    return this.http.get("http://localhost:8085/periods/" + obj)
    .map((res:Response)=>{
          return res.json();
    })
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  deletePeriodById(obj:number) :any
  {
    console.log("http://localhost:8085/periods/" + obj + "/delete");
    return this.http.get("http://localhost:8085/periods/" + obj + "/delete")
    .map((res:Response)=>{
          return res.json();
    })
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getActiveCourse() : any
  {
    console.log("http://localhost:8085/periods/active");
    return this.http.get("http://localhost:8085/periods/active")
    .map((res:Response)=>{
          return res.json();
    })
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getActiveCoursebcc() : any
  {
    console.log("http://localhost:8085/periods/active");
    return this.http.get("http://localhost:8085/periods/active")
    .map((res:Response)=>{
          return res.json();
    })
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }


  
//  addUser(employee: Employee, role: Role): Observable<Employee>{
//   var obj = {"employeeId":employee.employeeId, "roleId":role.roleId};
//   console.log(JSON.stringify({employeeId:employee.employeeId, roleId:role.roleId}));
//   return this.http.post("http://localhost:8085/employees/addrole",obj)
//   .map((res: Response) => res.json())
//   .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
// }



}

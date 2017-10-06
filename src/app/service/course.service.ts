import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions ,Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { LoginRequest } from '../model/loginrequest';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { Course } from '../model/course';
import { Employee } from '../model/employee';
import { CourseParticipant } from '../model/courseparticipant';
@Injectable()
export class CourseService {
   constructor(private http: Http) {
   }
 
   getCourses(): Observable<Course[]> {
      
      return this.http.get("http://localhost:8080/courses")
         .map((res: Response) => {return res.json();})
         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }

   getCoursesByTrainer(id:number): Observable<Course[]> {
      
      return this.http.get("http://localhost:8080/courses/trainer/"+id)
         .map((res: Response) => {return res.json();})
         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }

   getParticipantOfCourse(courseid:number): Observable<CourseParticipant[]> {
      
      return this.http.get("http://localhost:8080/courses/"+courseid+"/courseparticipants")
         .map((res: Response) => {return res.json();})
         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }
   updateAchievement(courseParticipant:CourseParticipant[]):Observable<CourseParticipant[]>{
      return this.http.post("http://localhost:8080/courses/update/achievement", courseParticipant)
      .map((res:Response)=>{
            return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }
}
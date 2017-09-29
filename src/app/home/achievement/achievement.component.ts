import { Component, OnInit } from '@angular/core';
import  {DataSource} from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MdSort} from '@angular/material';

import { Employee } from '../../model/employee';
import { Course } from '../../model/course';
import { LoginRequest } from '../../model/loginrequest';
import { Coursename } from '../../model/coursename';
import { TrainingPeriod } from '../../model/trainingperiod';

import { EmployeeService } from '../../service/employee.service';
import {CookieService } from 'angular2-cookie/services/cookies.service';
import { CoursenameService } from '../../service/coursename.service';

@Component({
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.css']
})
export class AchievementComponent implements OnInit {
  private userCookie: LoginRequest;
  private participant: Participant[]=[];

  dataSource:AchievementDataSource;
  private displayedColumns = [ ];
  private bcc : Coursename[]=[];

  constructor(
    private cookieService:CookieService,
    private employeeService:EmployeeService,
    private coursenameService:CoursenameService,
    ) { 
    this.userCookie=JSON.parse(this.cookieService.get('currentUserLocalHost'));
    this.employeeService.getById(this.userCookie.employeeId)
      .subscribe(user =>{
        if(user!=null){
        this.coursenameService.getBCCCoursenames().subscribe(
          coursenames =>{
            if(coursenames!=null){
            this.employeeService.getBCCCourses(user.employeeId)
              .subscribe(res=>{
                if(res!=null){
                  this.participant[0] = new Participant(user)
                  var i:number;
                  for(i=0; i < coursenames.length;i++){
                    this.participant[0].bccSet[i]=new BCC(coursenames[i]);
                    
                    this.displayedColumns[i] = coursenames[i].coursename;
                    var j:number=0;
                    for(j=0; j< res.length; j++){
                      if(this.participant[0].bccSet[i].coursename.coursenameid==res[j].course.coursename.coursenameid){
                        this.participant[0].bccSet[i].periodResult[this.participant[0].bccSet[i].periodResult.length] = new PeriodPass(
                          res[j].course.trainingPeriod,
                          res[j].pass
                          )
                      }
                    }
                }
                this.dataSource = new AchievementDataSource(this.participant);
              }
            })
          }
        })
      }
  })
  }

  ngOnInit() {
  }

}

export class AchievementDataSource extends DataSource<any> {
  constructor( private participant:Participant[]){
      super();
  }
  connect(): Observable<Participant[]> {
      return Observable.of(this.participant);
  }

  disconnect() {}
  }

class Participant{
  public bccSet:BCC[];
  constructor(
    public user:Employee
  ){
    this.bccSet=[]
  }
}

class BCC{
  public periodResult:PeriodPass[];
  constructor(
    public coursename:Coursename
  ){
    this.periodResult=[];
  }
}

class PeriodPass{
  constructor(
    public period: TrainingPeriod,
    public pass:boolean
  ){
  }
}
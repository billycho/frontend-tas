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
import { RoleService } from '../../service/role.service';

@Component({
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.css']
})
export class AchievementComponent implements OnInit {
  private currentUser: Employee;
  private managerOrAdmin:boolean;
  private bcc : Coursename[]=[];
  private participantId:number=4;

  private achievementList: EmployeeAchievementOutput[];
  dataSource:AchievementDataSource;
  private dynamicDisplayedColumns:String[] =[ ];
  private displayedColumns:String[] =[ ];
  
  constructor(
    private cookieService:CookieService,
    private employeeService:EmployeeService,
    private coursenameService:CoursenameService,
    private roleService:RoleService
    ) { 
    var cookie:LoginRequest=JSON.parse(this.cookieService.get('currentUserLocalHost'));
    this.employeeService.getById(cookie.employeeId).subscribe(
      user=>{
        this.coursenameService.getBCCCoursenames().subscribe(
          bcc =>{
            this.currentUser = user;
            this.managerOrAdmin = this.isManagerOrAdmin();

            if(!this.managerOrAdmin){
              this.bcc =bcc;
              var i:number=0;
              for(i = 0; i < this.bcc.length; i++){
                this.dynamicDisplayedColumns.push( this.bcc[i].coursename);
                this.displayedColumns.push( this.bcc[i].coursename);
              }

              this.getUserBCCAchievement(this.currentUser);

            }else{
              this.roleService.getEmployeesByRole(this.participantId).subscribe(
                participants=>{
                  this.bcc =bcc;

                  this.displayedColumns=["Id","Fullname","Jobfamily","Grade","Office"];

                  var i:number=0;
                  for(i = 0; i < this.bcc.length; i++){
                    this.dynamicDisplayedColumns.push( this.bcc[i].coursename);
                    this.displayedColumns.push( this.bcc[i].coursename);
                  }

                  this.displayedColumns.push("Action");
                  participants.forEach(
                    participant=>this.getUserBCCAchievement(participant)
                  )
                }
              )
            }
          }) 
      }
    )     
    }
  ngOnInit() {
  }
  
  getUserBCCAchievement(user:Employee){
    this.employeeService.getEmployeeBCC(user.employeeId)
    .subscribe(res=>{
      var participation: Participation= new Participation(user);

      var j:number=0;
      for(j=0; j< res.length; j++){
         participation.courseReport.push( new CourseReport(
            res[j].course.coursename,
            res[j].course.trainingPeriod,
            res[j].pass
            ))
      }
      this.appendToEmployeeAchievementOutput(participation);
    })
  }

  appendToEmployeeAchievementOutput(participation:Participation){
    var employeeAchievement: EmployeeAchievementOutput= new EmployeeAchievementOutput();

    employeeAchievement.id = participation.user.employeeId;
    employeeAchievement.fullname = participation.user.fullname;
    employeeAchievement.jobfamily = participation.user.grade.jobfamily;
    employeeAchievement.grade = participation.user.grade.grade;
    employeeAchievement.officebase = participation.user.location.locationName;

    var placementTest:number=-723;
    var i:number =0;
    for(i =0; i < this.bcc.length; i++){
      var j:number = 0;
      for(j =0; j < participation.courseReport.length; j++){
        if(this.bcc[i].coursenameid == participation.courseReport[j].coursename.coursenameid
            && participation.courseReport[j].period !=null 
            ){
          if(participation.courseReport[j].pass ==true){
            employeeAchievement.achievement[i] =participation.courseReport[j].period.periodName;
            if(participation.courseReport[j].period.periodName.match("Placement Test")!=null){
              placementTest = i;             
            }
          }else if(participation.courseReport[j].pass ==null){
            employeeAchievement.achievement[i] =participation.courseReport[j].period.periodName + " \n(In Progress)";
          }else{
            if(employeeAchievement.achievement[i]==null){
              employeeAchievement.achievement[i]=participation.courseReport[j].period.periodName +"\n (Failed)";
            }
          }
        }
      }
    }

    for(i =0; i <placementTest;i++){
      employeeAchievement.achievement[i]="Not Required";
    }

    if (this.achievementList ==null){
      this.achievementList =[];
    }
    this.achievementList.push(employeeAchievement);
    this.dataSource = new AchievementDataSource(this.achievementList);
  }

  isManagerOrAdmin():boolean{
    var i:number =0;
    var result:boolean =false;
    for(i=0; i<this.currentUser.roles.length;i++){
      if(this.currentUser.roles[i].roleId ==1 ||this.currentUser.roles[i].roleId==3){
        result=true;
      }
    }
    return result;
  }
}

export class AchievementDataSource extends DataSource<any> {
  returnParticipant:EmployeeAchievementOutput[];
  constructor( private participant:EmployeeAchievementOutput[]){
      super();
  }
  connect(): Observable<EmployeeAchievementOutput[]> {
      return Observable.of(this.participant);
  }

  disconnect() {}
  }

class EmployeeAchievementOutput{
  public id:number;
  public fullname:String;
  public jobfamily:String;
  public grade:String;
  public officebase:String;
  public achievement:String[];

  constructor(){
    this.achievement=[];
  }
}
class Participation{
  public courseReport:CourseReport[];
  constructor(
    public user:Employee
  ){
    this.courseReport=[];
  }
}

class CourseReport{
  constructor(
    public coursename:Coursename,
    public period: TrainingPeriod,
    public pass:boolean
  ){
  }
}
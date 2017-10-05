import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MdDialogRef,MD_DIALOG_DATA } from '@angular/material';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MdSnackBar} from '@angular/material';
import 'rxjs/add/observable/of';

import { Employee } from '../../model/employee';
import { Course } from '../../model/course';
import { LoginRequest } from '../../model/loginrequest';
import { Coursename } from '../../model/coursename';
import { CourseParticipant } from '../../model/courseparticipant';
import { TrainingPeriod } from '../../model/trainingperiod';

import { EmployeeService } from '../../service/employee.service';
import {CookieService } from 'angular2-cookie/services/cookies.service';
import { CoursenameService } from '../../service/coursename.service';
import { RoleService } from '../../service/role.service';
import {EmployeeMethod} from '../../service/employee.method';

@Component({
    templateUrl: 'editachievementdialog.component.html'
  })
  export class EditAchievementDialog {
    private loading=false;
    private participations : BccParticipation[]=[];

    constructor(
      public dialogEditAchievement: MdDialogRef<EditAchievementDialog>,    
      @Inject(MD_DIALOG_DATA) public data: any,
      private employeeService:EmployeeService,
      private coursenameService:CoursenameService,
      ) { }
    
    ngOnInit() {
        this.coursenameService.getBCCCoursenames().subscribe(
            coursenames=>{
                var i:number;
                for(i=0; i<coursenames.length; i++){
                    this.participations[i]=new BccParticipation();
                    this.participations[i].coursename=coursenames[i];
                }
                this.employeeService.getEmployeeBCC(this.data.id).subscribe(
                    courseparticipants=>{
                        for(i=0; i<coursenames.length; i++){
                            var j:number=0;
                            for(j=0; j< courseparticipants.length; j++){
                                if(this.participations[i].coursename.coursenameid == courseparticipants[j].course.coursename.coursenameid){
                                    var idx=0
                                    if(this.participations[i].courseParticipants==null){
                                        this.participations[i].courseParticipants=[];
                                    }
                                    else{
                                        idx=this.participations[i].courseParticipants.length;
                                    }
                                    this.participations[i].courseParticipants[idx]=new CourseParticipant();
                                    this.participations[i].courseParticipants[idx]=courseparticipants[j];
                                    if(this.participations[i].courseParticipants[idx].pass==true){
                                        this.participations[i].picked=idx;
                                    }
                                    if(this.participations[i].courseParticipants[idx].course.trainingPeriod.periodName.match("Placement Test")){
                                        this.participations[i].flag = "placementtest";
                                        var k:number=0;
                                        for(k=0; k<i; k++){
                                            this.participations[i].flag = "notrequired";
                                        }
                                    }
                                    
                                }
                            }
                        }
                        console.log(this.participations);
                        
                    }
                )
            }
        )
    }
    onNoClick(): void {
      this.closeDialog();
    }
    editAchievement(){

    }
    closeDialog(){
        this.dialogEditAchievement.close();
    }

  }

class BccParticipation{
    coursename:Coursename;
    courseParticipants:CourseParticipant[];
    picked;
    flag;
}
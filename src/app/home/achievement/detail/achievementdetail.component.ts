import { Component, Input, OnInit } from '@angular/core';
import  {DataSource} from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MdSort} from '@angular/material';
import {Location} from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import{ Course} from '../../../model/course';
import {TrainingPeriod} from '../../../model/trainingperiod';
import {CourseParticipant} from '../../../model/courseparticipant';
import {LoginRequest} from '../../../model/loginrequest';

import { EmployeeService } from '../../../service/employee.service';


@Component({
    templateUrl: './achievementdetail.component.html',
    selector:'achievement-detail'
})
export class AchievementDetailComponent implements OnInit {
    @Input() idParam:number;
    @Input() currentUser:LoginRequest;
    private courseParticipants:CourseParticipantEdit[]=[];
    private dataSource;
    private displayedColumns =['coursename','coursetype','periodname','startdate','enddate','maintrainer','result'];

    constructor(
        private employeeService:EmployeeService,
        private location: Location,
    ){
    }

    ngOnInit(){
        if(this.currentUser.role==1){
            this.displayedColumns.push('action');
        }
        this.load();
        
    }
    load(){
        this.employeeService.getAllCoursesOfAnEmployee(this.idParam).subscribe(
            courseparticipants=>{
                var i=0;
                for(i=0; i< courseparticipants.length; i++){
                    this.courseParticipants[i]= new CourseParticipantEdit();
                    this.courseParticipants[i].courseParticipant = courseparticipants[i];
                }
                this.dataSource = new AchievementDetailDataSource(this.courseParticipants);
            }
        )
    }
    back(){
        this.location.back();
    }
    save(){ 
        var temp:CourseParticipant[]=[];
        var i:number;
        for(i=0; i <this.courseParticipants.length; i++){
            temp[i]=new CourseParticipant();
            temp[i] = this.courseParticipants[i].courseParticipant;
        }
        console.log(temp);
        this.employeeService.updateAchievement(temp).subscribe(
            response=>{
                console.log(response);
                this.load();
            }
        )
    }
}

export class AchievementDetailDataSource extends DataSource<any> {
    constructor( private achievementList:CourseParticipantEdit[]){
        super();
    }
    connect(): Observable<CourseParticipantEdit[]> {
        return Observable.of(this.achievementList);
    }
  
    disconnect() {}
    }

class CourseParticipantEdit{
    public courseParticipant:CourseParticipant;
    public isEdit:boolean;
}
import { Component, OnInit, ElementRef, Inject, ViewChild} from '@angular/core';
import  {DataSource} from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator,MdSort} from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

import 'rxjs/add/observable/of';
import { Course } from '../../model/course';
import { CourseParticipant } from '../../model/courseparticipant';

import { CourseService } from '../../service/course.service';


@Component({
  templateUrl: './maintenancecourseparticipant.component.html',
})
export class MaintenanceCourseParticipantComponent implements OnInit {
    private idParam:number;
    private participants:CourseParticipant[];
    private dataSource;
    private displayedColumns=['id','fullname','jobfamily','grade','result'];
    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private courseService: CourseService,
    ){}
    ngOnInit(){
        
        this.route.params.subscribe(params => {
            this.idParam= +params['courseid'];
            this.courseService.getParticipantOfCourse(this.idParam).subscribe(
                participants=>{
                    this.participants =participants;
                    this.dataSource = new ParticipantMaintenanceDataSource(this.participants);
                }
            )
        });
    }
    save(){
        this.courseService.updateAchievement(this.participants).subscribe(
            response=>{
                console.log(response);
            }
        )
        console.log(this.participants);
    }
    back(){
        this.location.back();
    }
}

class ParticipantMaintenanceDataSource extends DataSource<any>{
    constructor(private participants: CourseParticipant[]){
        super();
      }
      connect(): Observable< CourseParticipant[]> {
        return Observable.of(this.participants);
      }
    
      disconnect() {}
    }
import { Component, OnInit, ElementRef, Inject, ViewChild} from '@angular/core';
import  {DataSource} from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator,MdSort} from '@angular/material';

import 'rxjs/add/observable/of';
import { Course } from '../../model/course';

import { CourseService } from '../../service/course.service';
import { LoginRequest } from '../../model/loginrequest';
import {CookieService } from 'angular2-cookie/services/cookies.service';

@Component({
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {
  private dataSource;
  private displayedColumns=['coursename', 'periodname', 'startdate', 'enddate', 'maintrainer','backuptrainer']
  constructor(
    private cookieService:CookieService,
    private courseService:CourseService
  ) { }

  ngOnInit() {
    var cookie:LoginRequest=JSON.parse(this.cookieService.get('currentUserLocalHost'));
    if(cookie.role==1){
      this.courseService.getCourses().subscribe(
        courses=>{
          this.dataSource = new MaintenanceDataSource(courses);
        }
      )
    }
    if(cookie.role==3){
      this.courseService.getCoursesByTrainer(cookie.employeeId).subscribe(
        courses=>{
          this.dataSource = new MaintenanceDataSource(courses);
        }
      )
    }
    
    
  }

}
class MaintenanceDataSource extends DataSource<any>{
constructor(private courses: Course[]){
    super();
  }
  connect(): Observable< Course[]> {
    return Observable.of(this.courses);
  }

  disconnect() {}
}


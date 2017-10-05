import { Component, Input, OnInit } from '@angular/core';
import  {DataSource} from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MdSort} from '@angular/material';

import { Employee } from '../../../model/employee';
import { Course } from '../../../model/course';
import { LoginRequest } from '../../../model/loginrequest';
import { Coursename } from '../../../model/coursename';
import { TrainingPeriod } from '../../../model/trainingperiod';

import { EmployeeService } from '../../../service/employee.service';
import {CookieService } from 'angular2-cookie/services/cookies.service';
import { CoursenameService } from '../../../service/coursename.service';
import { RoleService } from '../../../service/role.service';
import {EmployeeMethod} from '../../../service/employee.method';

@Component({
    templateUrl: './bccachievementdetail.component.html',
    selector:'bcc-achievement-detail'
})
export class BccAchievementDetailComponent implements OnInit{
    @Input() idParam:number;
    private showingUser: Employee;
    private bccs : BCC[]=[];
    private participantId:number=4;

    private headerCols:number=0;
  
    private userMethod:EmployeeMethod;
    
    constructor(
      private employeeService:EmployeeService,
      private coursenameService:CoursenameService,
      ) { 
      }
    ngOnInit() {
        this.coursenameService.getBCCCoursenames().subscribe(
            bccs=>{
                var i:number;
                for(i=0; i <bccs.length; i++){
                    this.bccs.push(new BCC(bccs[i]));
                }
                console.log(this.bccs);
                this.employeeService.getEmployeeBCC(this.idParam).subscribe(
                    res=>{
                        var j:number = 0;
                        for(j =0; j<res.length; j++){
                            var k:number =0;
                            for(k=0; k<this.bccs.length;k++){
                                if(this.bccs[k].coursename.coursenameid == res[j].course.coursename.coursenameid){
                                    this.bccs[k].courseReport.push(new CourseReport(res[j].course.trainingPeriod,
                                    res[j].pass));
                                }
                            }
                        }

                        // var placementTest:number=0;
                        // var j:number = 0;
                        // for(j =0; j<this.bccs.length; j++){
                        //     var k:number =0;
                        //     for(k=0; k<this.bccs[j].courseReport.length;k++){
                        //         if(this.bccs[j].courseReport[k].period.periodName.match("Placement Test")!=null){
                        //             placementTest=j;
                        //         }
                        //     }
                        // }

                        for(j=0; j <this.bccs.length; j++){
                            // if(j < placementTest){
                            //     this.bccs[j].comment=-723;
                            // }else{
                                var k:number =0;
                                for(k=0; k < this.bccs[j].courseReport.length;k++){
                                    if(this.bccs[j].courseReport[k].pass==true){
                                        this.bccs[j].show=k;
                                    }
                                }
                            // }
                            
                        }
                        console.log(this.bccs);
                        this.headerCols =this.columnSize();
                        console.log(this.headerCols);
                    }
                )
            }
        )
    }

    columnSize():number{
        var i:number=0;

        var result:number=0;
        for(i=0; i<this.bccs.length; i++){
            if(this.bccs[i].courseReport.length!=0){
                result+=this.bccs[i].courseReport.length;
            }else{
                result+=1;
            }
        }
        // console.log(result);
        return result;
    }
       
}
class BCC{
    public courseReport:CourseReport[];
    public show:number;
    constructor(
        public coursename:Coursename
    ){
        this.courseReport = [];
    }
}
class CourseReport{
    constructor(
      public period: TrainingPeriod,
      public pass:boolean
    ){
    }
}
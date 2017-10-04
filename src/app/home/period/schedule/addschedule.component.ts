import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator,MdSort } from '@angular/material';
import { TrainingPeriod } from '../../../model/trainingperiod';
import { Employee } from '../../../model/employee';
import { PeriodService } from '../../../service/period.service';
import { EmployeeService } from '../../../service/employee.service';
import {MdSnackBar} from '@angular/material';

@Component({
  templateUrl: 'addschedule.html',
  styleUrls: ['./schedule.component.css']
})
export class AddScheduleDialog {
  addScheduleFormControl = new FormControl('', [
    Validators.required
  ]);


  capacity:any;
  data:any;
  day:any;

  trainer:Employee[];
  mainTrainer:any;
  backupTrainer:any;
  room:any;
  coursename:any;

  rooms:any[];
  coursenames:any[];
  courseId:any;
  date:any;

  trainingId:any;

  periodical:boolean;

  constructor(
    public dialogRef: MdDialogRef<AddScheduleDialog>, @Inject(MD_DIALOG_DATA) public dialogData: any, private employeeService:EmployeeService, private periodService:PeriodService,private alertSnackBar:MdSnackBar) {
      this.trainingId = dialogData.trainingId;
      this.employeeService.getTrainer().subscribe(((response) => {
      this.day = 0;
        console.log(response);
        this.trainer = response;
        this.courseId = -1;
        // for(var i = 0;i<this.trainer.length;i++)
        // {
        //   console.log(this.trainer[i].fullname);  
        // }
      }));

      this.periodService.getPeriodById(this.trainingId).subscribe((response) => {
         console.log(response);
         this.periodical = response['periodical'];
         console.log(this.periodical);
      });

      this.employeeService.getRooms().subscribe(((response) => {
        
                console.log(response);
                this.rooms = response;
        
                // for(var i = 0;i<this.rooms.length;i++)
                // {
                //   console.log(this.rooms[i].roomId);  
                // }
              }));
      
      this.periodService.getCourseName().subscribe(((response) => {
              console.log(response);
              this.coursenames = response;

              // for(var i = 0;i<this.coursenames.length;i++)
              // {
              //   console.log(this.coursenames[i].coursenameid);  
              // }
      }));
      
      this.capacity = 5;
      //this.htmlToAdd = '<div md-dialog-content><md-form-field color="accent"><input mdInput  required placeholder="End Date" [(ngModel)]="data" name="endDate" [mdDatepicker]="endDate" [min]="startDate1"> <md-datepicker-toggle mdSuffix [for]="endDate"></md-datepicker-toggle><md-datepicker #endDate></md-datepicker><md-error *ngIf="addPeriodFormControl.hasError("required")"> End Date is <strong>required</strong> </md-error></md-form-field></div>';
  
     }

     submit()
     {
        console.log(this.mainTrainer);
        console.log(this.backupTrainer);
        console.log(this.room);
        console.log(this.coursename);
        console.log(this.date.toLocaleDateString());
        console.log(this.capacity);


        var obj = {"day":this.day,"courseId": this.courseId ,"mainTrainer":this.mainTrainer, "backupTrainer":this.backupTrainer, "room": this.room, "coursename":this.coursename, "date": this.date.toLocaleDateString(), "capacity": this.capacity};
        
        this.periodService.addCourseSchedule(obj, this.trainingId).subscribe((response) => {
         this.courseId = response; 
          console.log(response);
          this.alertSnackBar.open("Schedule created",'', {
            duration:3000
          });
          if(!this.periodical)
          this.onNoClick();

        });

      };

   
     

  onNoClick(): void {
    this.dialogRef.close();
  }
  

  



}
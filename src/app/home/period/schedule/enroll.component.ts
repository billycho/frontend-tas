import { Component,ElementRef, OnInit, Inject, ViewChild  } from '@angular/core';
import { PeriodService } from '../../../service/period.service';
import { EmployeeService } from '../../../service/employee.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import {Employee} from '../../../model/employee';
import {EligibleParticipant} from '../../../model/eligible';
import {MdSnackBar} from '@angular/material';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator,MdSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html'
})
export class EnrollParticipantComponent implements OnInit {
  @ViewChild('filter') filter: ElementRef;
 constructor(   public dialogEnroll: MdDialogRef<EnrollParticipantComponent>,private periodService:PeriodService,private employeeService:EmployeeService, @Inject(MD_DIALOG_DATA) public dialogData: any, private alertSnackBar:MdSnackBar  ) {
       console.log("open")
   }

  ngOnInit() {
  }

  closeDialog(){
    this.dialogEnroll.close();
}

  
  

}




import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator,MdSort } from '@angular/material';
import { TrainingPeriod } from '../../model/trainingperiod';
import { PeriodService } from '../../service/period.service';

@Component({
  templateUrl: 'add-period-dialog.html',
  styleUrls: ['./period.component.css']
})
export class AddPeriodDialog {
  addPeriodFormControl = new FormControl('', [
    Validators.required
  ]);

  data:TrainingPeriod;
  operation:string;
  operationName:string;
  statePeriods:any;
  constructor(
    public dialogRef: MdDialogRef<AddPeriodDialog>, @Inject(MD_DIALOG_DATA) public dialogData: any,private periodService:PeriodService) {
      this.data = new TrainingPeriod();
      this.statePeriods = [
        {value: true, viewValue: 'Fixed'},
        {value: false, viewValue: 'Periodical'}
      ];
      this.operation = dialogData.operation;

      if(dialogData.operation == 'edit')
      { 
        this.operationName = "Edit";
        console.log(dialogData.open);
        
        console.log(dialogData.endDate);
        this.data.updatedDate = new Date();
        this.data.createdDate = new Date(dialogData.createdDate);
        this.data.startDate = new Date(dialogData.startDate);
        this.data.endDate = new Date(dialogData.endDate);
        console.log(dialogData.startDate);
        console.log(this.data.startDate);
  
        this.data.periodName = dialogData.trainingName;
        this.data.openenrollment = dialogData.open;
        this.data.periodical = dialogData.periodical;
        this.data.trainingPeriodId = dialogData.trainingPeriodId;
      }
      else
      {
        this.operation = "create";
        this.operationName = "Create";
        this.data.createdDate = new Date();
        this.data.startDate = new Date();
        this.data.endDate = new Date();
  
        this.data.periodName = "";
        this.data.openenrollment = false;
        this.data.periodical = false;
       
        
      }

      
     }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  asda(): void {
    console.log(this.data.startDate);
  }

  submit() :void {

    if(this.operation == "edit")
    {
       console.log("edit");
       this.periodService.editTrainingPeriod(this.data).subscribe(((periodDatas) => {
        this.dialogRef.close();

       })); 
    }
    else
    {
      this.periodService.addTrainingPeriod(this.data).subscribe(((periodDatas) => {
       this.dialogRef.close();
      })); 
    }
    
  }

  



}
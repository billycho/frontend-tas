import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator,MdSort } from '@angular/material';
import { TrainingPeriod } from '../../model/trainingperiod';
import { PeriodService } from '../../service/period.service';

@Component({
  templateUrl: 'perioddetail.html',
  styleUrls: ['./period.component.css']
})
export class DetailPeriodDialog {
  addPeriodFormControl = new FormControl('', [
    Validators.required
  ]);

  
  constructor(
    public dialogRef: MdDialogRef<DetailPeriodDialog>, @Inject(MD_DIALOG_DATA) public dialogData: any) {


      
     }

  onNoClick(): void {
    this.dialogRef.close();
  }
  

  



}
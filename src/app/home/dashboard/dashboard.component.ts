import {Component} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Active Training DataStream
  activeTrainingColumns = ['courseName', 'mainTrainer', 'backupTrainer', 'startDate', 'endDate', 'trainingLocation'];
  activeTrainingDataSource = new ActiveTrainingDataSource();
  
  //BCC Schedule DataStream
  BCCColumns = ['trainerName', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  BCCDataSource = new BCCDataSource();

}

//Active Training Interface and Data Stream Controller
export interface activeTraining {
  courseName: string;
  mainTrainer: string;
  backupTrainer: string;
  startDate: string;
  endDate: string;
  trainingLocation: string;
}

const activeTrainingData: activeTraining[] = [
  {courseName: 'Angular 2', mainTrainer: 'Carmen', backupTrainer:'-', startDate:'21-08-2017', endDate: '20-09-2017', trainingLocation: "Bali"},
  {courseName: 'Full Stack', mainTrainer: 'Agus', backupTrainer:'Budi', startDate:'10-08-2017', endDate: '09-09-2017', trainingLocation: "Yogyakarta"},
  {courseName: 'Database', mainTrainer: 'Budi Wasweswos', backupTrainer:'Sudyatmiko', startDate:'11-08-2017', endDate: '11-09-2017', trainingLocation: "Yogyakarta"}
]

export class ActiveTrainingDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<activeTraining[]> {
    return Observable.of(activeTrainingData);
  }

  disconnect() {}
}

//BCC Schedule Interface and Data Stream Controller

export interface BCCSchedule {
  trainerName: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
}

const BCCScheduleData: BCCSchedule[] = [
  {trainerName: "Denny", monday:'Bali office (10.00 - 12.00)', tuesday:"-", wednesday:'-',thursday: '-', friday:'-'},
  {trainerName: "Dimas", monday:'-', tuesday:"-", wednesday:'-',thursday: 'Yogyakarta office (15.00 - 17.00)', friday:'-'},
]

export class BCCDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<BCCSchedule[]> {
    return Observable.of(BCCScheduleData);
  }

  disconnect() {}
}
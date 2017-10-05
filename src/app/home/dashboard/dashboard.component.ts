import {Component,  ElementRef, OnInit, Inject, ViewChild} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PeriodService } from '../../service/period.service';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator,MdSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent  {

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild(MdPaginator) paginator1: MdPaginator;
  // Active Training DataStream
  activeTrainingColumns = ['courseName', 'mainTrainer', 'backupTrainer', 'startDate', 'endDate', 'trainingLocation'];
  activeTrainingDataSource;
  activeTrainingDatabase;
  
  //BCC Schedule DataStream
  BCCColumns = ['trainerName', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  BCCDataSource = new BCCDataSource();

  //location
  locations;
  loginResponse;

  activeCourse:any[];

  activebccDatabase;
  activebccDataSource;
  activeBCC:any[];

  dummy:string;
  constructor(private periodService:PeriodService) {
    this.periodService.getActiveCoursebcc().subscribe(((response) => {
      console.log(response);
      this.activeBCC = response;


      for(var i = 0;i<response.length;i++)
      {
          console.log(response[i].date);
          var x = new Date(response[i].date);
          this.activeBCC[i]['day'] = x.getDay();
          console.log(x.getDay());
      }

      this.activebccDatabase = new ActiveBCCDatabase(this.activeBCC);
      
      
      
            
      this.activebccDataSource = new ActiveBCCDataSource (this.activebccDatabase);
      


    }));
    this.periodService.getActiveCourse().subscribe(((response) => {
      console.log(response);
      this.activeCourse = response;

      this.activeTrainingDatabase = new ActiveCourseDatabase(this.activeCourse);

      this.paginator._length = this.activeTrainingDatabase.data.length;
      this.paginator.pageSize = 5;
      this.paginator._pageIndex = 0;

      
      this.activeTrainingDataSource = new ActiveCourseDataSource(this.activeTrainingDatabase, this.paginator, this.sort);

    }));
   
   // locationService.addComment();

    //locationService.addComment().subscribe((loginResponse) => {this.loginResponse = loginResponse;alert(loginResponse.status)});
    
  }


}

export class ActiveCourseDatabase {
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataChange.value; }


    constructor(private periodDatas: any[]) {
  
      this.dataChange.next(periodDatas);
   
  }
}

export class ActiveCourseDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');

  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: any[] = [];
  renderedData: any[] = [];
  //sortedData: Period[] = [];
  constructor(private _activeCourseDatabase: ActiveCourseDatabase,  private _paginator: MdPaginator,private _sort: MdSort) {
    super();
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this._activeCourseDatabase.dataChange,
      this._filterChange,
      this._paginator.page,
      this._sort.mdSortChange,
    ];


    return Observable.merge(...displayDataChanges).map(() => {

     
        // this.filteredData = this._periodDatabase.data.slice().filter((item: TrainingPeriod) => {
        //   let searchStr = (item.periodName).toLowerCase();
        //   let searchStr1 = (item.createdDate).toString();
        //   let searchStr2 = (item.employee.fullname);
        //   return searchStr2.indexOf(this.name.toLowerCase()) != -1 && searchStr1.indexOf(this.created.toLowerCase()) != -1;
        // });

        this.filteredData = this._activeCourseDatabase.data.slice();
        
  

      
 

        
        this._paginator._length = this.filteredData.length;
        this._paginator.ngOnInit();
  
       const sortedData = this.getSortedData(this.filteredData.slice());
       const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
       this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
  
        return this.renderedData;

    });
  }

  disconnect() {}

  
  getSortedData(data: any[]): any[] {
    //const data = this._periodDatabase.data.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'trainingPeriodID': [propertyA, propertyB] = [a.courseName, b.courseName]; break;
        
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}

export class ActiveBCCDatabase {
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataChange.value; }


    constructor(private periodDatas: any[]) {
  
      this.dataChange.next(periodDatas);
   
  }
}

export class ActiveBCCDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');

  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: any[] = [];
  renderedData: any[] = [];
  //sortedData: Period[] = [];
  constructor(private _activeCourseDatabase: ActiveBCCDatabase) {
    super();
  }

  connect(): Observable<any[]> {
    const displayDataChanges = [
      this._activeCourseDatabase.dataChange,
      this._filterChange
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      this.filteredData = this._activeCourseDatabase.data.slice();

        return this._activeCourseDatabase.data.slice();

    });
  }

  disconnect() {}

}

//Active Training Interface and Data Stream Controller
// export interface activeTraining {
//   courseName: string;
//   mainTrainer: string;
//   backupTrainer: string;
//   startDate: string;
//   endDate: string;
//   trainingLocation: string;
// }

// const activeTrainingData: activeTraining[] = [
//   {courseName: 'Angular 2', mainTrainer: 'Carmen', backupTrainer:'-', startDate:'21-08-2017', endDate: '20-09-2017', trainingLocation: "Bali"},
//   {courseName: 'Full Stack', mainTrainer: 'Agus', backupTrainer:'Budi', startDate:'10-08-2017', endDate: '09-09-2017', trainingLocation: "Yogyakarta"},
//   {courseName: 'Database', mainTrainer: 'Budi Wasweswos', backupTrainer:'Sudyatmiko', startDate:'11-08-2017', endDate: '11-09-2017', trainingLocation: "Yogyakarta"}
// ]

// export class ActiveTrainingDataSource extends DataSource<any> {
//   /** Connect function called by the table to retrieve one stream containing the data to render. */
//   connect(): Observable<activeTraining[]> {
//     return Observable.of(activeTrainingData);
//   }

//   disconnect() {}
// }

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
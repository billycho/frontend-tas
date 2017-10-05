import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator,MdSort } from '@angular/material';
import { DatePipe } from '@angular/common';

import { FormControl, Validators } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Location } from '../../model/location';
import { LocationService } from '../../service/location.service';

import { TrainingPeriod } from '../../model/trainingperiod';
import { PeriodService } from '../../service/period.service';
import { AddPeriodDialog } from './addperioddialog.component'
import { AddeligibleComponent} from './addeligible.component'
import { DetailPeriodDialog } from './perioddetail.component'
import {MdSnackBar} from '@angular/material';

//Structure
@Component({
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.css']
})
export class PeriodComponent {
 
  @ViewChild('filter') filter: ElementRef;
  @ViewChild('filter1') filter1: ElementRef;
  @ViewChild('filterCreatedBy') filterCreatedBy: ElementRef;
  @ViewChild('filterUpdatedBy') filterUpdatedBy: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  ngOnInit() {
    //this.dataSource = new PeriodDataSource(this.periodDatabase, this.paginator, this.sort);

  }
  

  //searchby
  trainingName: string;
  createdDate: Date;
  startDateData: Date;
  endDateData: Date;
  updatedDateData: Date;

  createdBy: string;

  dashboardAT: Location[];

  displayedColumns = ['trainingPeriodID','periodName','startDate','endDate','creatorID','createdDate','updaterID','updateDate','periodical','openEnrollment','act'];
  periodDatabase;
  dataSource: PeriodDataSource | null;

  periodDatas:TrainingPeriod[];
  constructor(private alertSnackBar:MdSnackBar ,public addPeriod: MdDialog,private locationService:LocationService, private periodService:PeriodService) {
   // this.periodDatabase = new PeriodDatabase();

   this.periodService.getTrainingPeriods().subscribe(((periodDatas) => {
    this.periodDatas = periodDatas;

    this.periodDatas = this.periodDatas.filter(item => item['active'] != false);  

    
    console.log(this.periodDatas);
    this.periodDatabase = new PeriodDatabase(this.periodDatas); 

    this.paginator._length = this.periodDatabase.data.length;
    this.paginator.pageSize = 10;
    this.paginator._pageIndex = 0;

    this.dataSource = new PeriodDataSource(this.periodDatabase, this.paginator, this.sort);

    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }

      this.dataSource.name = this.filter.nativeElement.value;
      this.dataSource.filter = this.filter.nativeElement.value;
   
      // //alert(this.filter1.nativeElement.value);
    });

    Observable.fromEvent(this.filterCreatedBy.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }

      this.dataSource.createdBy = this.filterCreatedBy.nativeElement.value;
      this.dataSource.filter = this.filterCreatedBy.nativeElement.value;
   
      // //alert(this.filter1.nativeElement.value);
    });

    Observable.fromEvent(this.filterUpdatedBy.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }

      this.dataSource.updatedBy = this.filterUpdatedBy.nativeElement.value;
      this.dataSource.filter = this.filterUpdatedBy.nativeElement.value;
   
      // //alert(this.filter1.nativeElement.value);
    });


    // Observable.fromEvent(this.filter1.nativeElement, 'keyup')
    // .debounceTime(150)
    // .distinctUntilChanged()
    // .subscribe(() => {
    //   if (!this.dataSource) { return; }
    //   alert(this.filter1.nativeElement.value);
    //   this.dataSource.created = this.filter1.nativeElement.value;
    //   this.dataSource.filter = this.filter1.nativeElement.value;
    // });

  }));

    // this.locationService.getLocations().subscribe(((dashboardAT) => {
    //   this.dashboardAT = dashboardAT;
      
    //   //this.dataSource = new PeriodDataSource(this.periodDatabase, this.paginator, this.sort);
    //   this.periodDatabase = new PeriodDatabase(this.dashboardAT); 
    //   this.dataSource = new PeriodDataSource(this.periodDatabase, this.sort);
    // }));

    
  }
  
  //

  openDeleteDialog(period:TrainingPeriod)
  {
    var r = confirm("Are you sure want to delete this period? (all of the course data will be deleted too");

    if(r == true)
    {
        this.periodService.deletePeriodById(period.trainingPeriodId).subscribe(((response) => {
          console.log(response);

          this.alertSnackBar.open("Period with id " + period.trainingPeriodId + " deleted",'', {
            duration:3000
          });

          this.refresh();
        }));          
    }
    else
    {
      
    }
  }
  
  checkDate(operation: string): void {
    if (!this.dataSource) { return; }
    //alert(this.trainingName.toString().toLocaleLowerCase());

   
      //this.createdDate = new Date(this.createdDate);
      
      var month;
      var date;
      var dateData;

      
      if(operation == "created")
      {
          dateData = this.createdDate;
          if(dateData == null)
          {
            this.dataSource.created ="";
            this.dataSource.filter =  "";
          }
      }
      else if(operation == "updated")
      {
          dateData = this.updatedDateData; 
          if(dateData == null)
          {
            this.dataSource.updated ="";
            this.dataSource.filter =  "";
          }
      }
      else if(operation == "start")
      {
          dateData = this.startDateData; 
          if(dateData == null)
          {
            this.dataSource.start ="";
            this.dataSource.filter =  "";
          }
      }
      else if(operation == "end")
      {
          dateData = this.endDateData;  
          if(dateData == null)
          {
            this.dataSource.end ="";
            this.dataSource.filter =  "";
          }
      }

      if(dateData == null)
        {
          return;
        }

     


      //operation
      if(dateData.getDate()<9)
      {
        date = "0" + (dateData.getDate());
      }
      else
      {
        date = dateData.getDate(); 
      }
      
      
      if(dateData.getMonth()<9)
      {
        month = "0" + (dateData.getMonth()+1); 
      }
      else if(dateData.getMonth()>=9)
      {
        month = dateData.getMonth() + 1; 
      }
      //1970-01-01
      if(month == "01" && date == "01" && dateData.getFullYear().toString() == "1970" )
      {
        this.dataSource.created ="";
        this.dataSource.filter =  "";
      }
      else
      {
        if(operation == "created")
        {
          this.dataSource.created = dateData.getFullYear() + "-" + month + "-" + date;
        }
        else if(operation == "updated")
        {
          this.dataSource.updated = dateData.getFullYear() + "-" + month + "-" + date;
        }
        else if(operation == "start")
        {
            this.dataSource.start = dateData.getFullYear() + "-" + month + "-" + date;
        }
        else if(operation == "end")
        {
            this.dataSource.end = dateData.getFullYear() + "-" + month + "-" + date;
        }

        this.dataSource.filter =  dateData.getFullYear() + "-" +  month + "-" + date;
        
       
     
      }
      
  }

  openDialog(): void {
    // let dialogRef = this.addPeriod.open(AddPeriodDialog, {
    //   height: '600px',
    //   width: '800px'
    // });

    let dialogRef = this.addPeriod.open(AddPeriodDialog, {
      width: '40%',
      data: { trainingName: "",operation: "add" }
    });

    dialogRef.afterClosed().subscribe(result=>{

         this.refresh();
    });
  }

  openEditDialog(operation:string, period:TrainingPeriod): void {
    // let dialogRef = this.addPeriod.open(AddPeriodDialog, {
    //   height: '600px',
    //   width: '800px'
    // });

    let dialogRef = this.addPeriod.open(AddPeriodDialog , {
      width: '40%',
      data: { trainingPeriodId: period.trainingPeriodId, open: period.openenrollment, periodical: period.periodical, trainingName: period.periodName, startDate: period.startDate, endDate:period.endDate , createdDate: period.createdDate, operation: 'edit' }
      
    });

    dialogRef.afterClosed().subscribe(result => {
      
      this.refresh();
    });

   
  }

  openEligible(period:TrainingPeriod)
  {
    let dialogRef = this.addPeriod.open(AddeligibleComponent, {
      width: '40%',
      data: { trainingPeriodId: period.trainingPeriodId, open: period.openenrollment, periodical: period.periodical, trainingName: period.periodName, startDate: period.startDate, endDate:period.endDate , createdDate: period.createdDate, operation: 'edit' }
      
    });
  }


  openDetail(period:TrainingPeriod)
  {
    let dialogRef = this.addPeriod.open(DetailPeriodDialog, {
      width: '40%',
      data: { updatedDate: period.updatedDate, creator: period.employee.fullname, updater: period.updaterID.fullname,trainingPeriodId: period.trainingPeriodId, open: period.openenrollment, periodical: period.periodical, trainingName: period.periodName, startDate: period.startDate, endDate:period.endDate , createdDate: period.createdDate, operation: 'edit' }
      
    });
  }

  refresh():void
  {
    this.periodService.getTrainingPeriods().subscribe(((periodDatas) => {
      this.periodDatas = periodDatas;
      this.periodDatas = this.periodDatas.filter(item => item['active'] != false);  
      
      this.periodDatabase = new PeriodDatabase(this.periodDatas); 
  
      this.paginator._length = this.periodDatabase.data.length;
      this.paginator.pageSize = 10;
      this.paginator._pageIndex = 0;
  
      this.dataSource = new PeriodDataSource(this.periodDatabase, this.paginator, this.sort);
  
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
  
        this.dataSource.name = this.filter.nativeElement.value;
        this.dataSource.filter = this.filter.nativeElement.value;
     
        // //alert(this.filter1.nativeElement.value);
      });
  
      Observable.fromEvent(this.filterCreatedBy.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
  
        this.dataSource.createdBy = this.filterCreatedBy.nativeElement.value;
        this.dataSource.filter = this.filterCreatedBy.nativeElement.value;
      });
  
    }));
  }

  


}


//table

export class PeriodDatabase {
  dataChange: BehaviorSubject<TrainingPeriod[]> = new BehaviorSubject<TrainingPeriod[]>([]);
  get data(): TrainingPeriod[] { return this.dataChange.value; }


    constructor(private periodDatas: TrainingPeriod[]) {
  
      this.dataChange.next(periodDatas);
   
  }
}

export class PeriodDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  public type:string;
  public created:string = "";
  public name:string = "";
  public createdBy:string = "";
  public updatedBy:string = "";
  public updated:string = "";
  public start:string = "";
  public end:string = "";
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filter123(filter:string,type:string)
  {
    this.type = type;
    this._filterChange.next(filter);
  }
  filteredData: TrainingPeriod[] = [];
  renderedData: TrainingPeriod[] = [];
  //sortedData: Period[] = [];
  constructor(private _periodDatabase: PeriodDatabase,  private _paginator: MdPaginator,private _sort: MdSort) {
    super();
    this.type = "1";
  }

  connect(): Observable<TrainingPeriod[]> {
    const displayDataChanges = [
      this._periodDatabase.dataChange,
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

        this.filteredData = this._periodDatabase.data.slice().filter((item: TrainingPeriod) => {
          let searchStr = (item.periodName).toLowerCase();
          let searchStr1 = (item.createdDate).toString();
          let searchStr2 = (item.employee.fullname).toLowerCase();
          let searchStr3 = (item.updatedDate).toString();
          let searchStr4 = (item.startDate).toString();
          let searchStr5 = (item.endDate).toString();
          let searchStr6 = (item.updaterID.fullname).toLowerCase();
         
          return searchStr.indexOf(this.name.toLowerCase()) != -1 && searchStr1.indexOf(this.created.toLowerCase()) != -1 && searchStr2.indexOf(this.createdBy.toLowerCase()) != -1 
          && searchStr3.indexOf(this.updated.toLowerCase()) != -1 && searchStr4.indexOf(this.start.toLowerCase()) != -1 && searchStr5.indexOf(this.end.toLowerCase()) != -1 && searchStr6.indexOf(this.updatedBy.toLowerCase()) != -1 ;
          // return searchStr.indexOf(this.name.toLowerCase()) != -1 && searchStr1.indexOf(this.created.toLowerCase()) != -1 && searchStr2.indexOf(this.createdBy.toLowerCase()) != -1 
          // && searchStr3.indexOf(this.updated.toLowerCase()) != -1 && searchStr4.indexOf(this.start.toLowerCase()) != -1 && searchStr5.indexOf(this.end.toLowerCase()) != -1  ;

        });
        
  

      
 

        
        this._paginator._length = this.filteredData.length;
        this._paginator.ngOnInit();
  
       const sortedData = this.getSortedData(this.filteredData.slice());
       const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
       this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
  
        return this.renderedData;

    });
  }

  disconnect() {}

  
  getSortedData(data: TrainingPeriod[]): TrainingPeriod[] {
    //const data = this._periodDatabase.data.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'trainingPeriodID': [propertyA, propertyB] = [a.trainingPeriodId, b.trainingPeriodId]; break;
        
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
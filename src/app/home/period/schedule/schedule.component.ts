import { Component, OnInit, ElementRef, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';

import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator,MdSort, MdSnackBar} from '@angular/material';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { Employee} from '../../../model/employee';
import { EmployeeMethod } from '../../../service/employee.method';
import { Role } from '../../../model/role';

import { EmployeeService } from '../../../service/employee.service';
import { RoleService } from '../../../service/role.service';
import { AlertService } from '../../../service/alert.service';
import { PeriodService } from '../../../service/period.service';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import  {DataSource} from '@angular/cdk/collections';
import {EnrollParticipantComponent} from './enroll.component'

@Component({
    templateUrl: './schedule.component.html',
  })

export class ScheduleComponent {
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MdSort) sort: MdSort;
    @ViewChild(MdPaginator) paginator: MdPaginator;
    periodId:any;
    schedules:any[];
    //dataSource:ScheduleDataSource;
    scheduleDatabase;
    dataSource;

    displayedColumns = ['courseScheduleId','course_name','trainer', 'date','room','participant','action'];
  
    
    constructor(
        private route: ActivatedRoute,
        private alertService: AlertService,
        private alertSnackBar:MdSnackBar,
        private periodService:PeriodService,
        public enrollDialog: MdDialog
    )
    {
        this.route.params.subscribe((params: Params) => {
            this.periodId = params['id'];
         
          });

          this.periodService.getScheduleByPeriod(this.periodId).subscribe(((response) => {
       
            this.schedules = response;

            this.scheduleDatabase = new ScheduleDatabase(response);
            this.paginator._length = this.scheduleDatabase.data.length;
            this.paginator.pageSize = 10;
            this.paginator._pageIndex = 0;
            this.dataSource = new ScheduleDataSource(this.scheduleDatabase, this.paginator,this.sort);
         
            Observable.fromEvent(this.filter.nativeElement, 'keyup')
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe(() => {
              if (!this.dataSource) { return; }
              this.dataSource.filter = this.filter.nativeElement.value;
            });


          }));
    }
    
    enrollParticipant(courseid:number)
    {
        alert(courseid);

        
      let dialogRef = this.enrollDialog.open(EnrollParticipantComponent, {
        width: '40%',
        data: { trainingName: "",operation: "add" }
      });
  
      dialogRef.afterClosed().subscribe(result=>{
           //this.refresh();
      });

    }

 
    
}

export class ScheduleDatabase {
    dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    get data(): any[] { return this.dataChange.value; }
  
    // constructor()
    // {
  
    // }
    constructor(private datas:any[])
    {
     // alert(dataAT.length);
    
          this.dataChange.next(datas);
        
    }
  }

  export class ScheduleDataSource extends DataSource<any> {
    
    // constructor(private users: Employee[]){
    //   super();
    // }
    // connect(): Observable<Employee[]> {
    //   return Observable.of(this.users);
    // }
  
    // disconnect() {}
  
    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) {
      this._filterChange.next(filter);
    }
    filteredData: any[] = [];
    renderedData: any[] = [];
    sortedData: any[] = [];
    constructor(private _schDatabase: ScheduleDatabase,  private _paginator: MdPaginator, private _sort: MdSort) {
      super();
    }
    connect(): Observable<any[]> {
      const displayDataChanges = [
        this._schDatabase.dataChange,
        this._filterChange,
        this._paginator.page,
        this._sort.mdSortChange,
      ];
  
  
      return Observable.merge(...displayDataChanges).map(() => {
        //return this.getSortedData();
      //console.log("ok");
       //console.log(this._paginator.pageIndex);
  
       //his.filteredData = this._schDatabase.data.slice();
       this.filteredData = this._schDatabase.data.slice().filter((item: any) => {
        let searchStr = (item.course.coursename.coursename).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
       const sortedData = this.getSortedData(this.filteredData.slice());
    //    const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
    //    this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
  
        return sortedData;
       
        
  
        
  
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
          case 'courseScheduleId': [propertyA, propertyB] = [a.courseScheduleId, b.courseScheduleId]; break;
        }
  
        let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        let valueB = isNaN(+propertyB) ? propertyB : +propertyB;
  
        return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
      });
    }
  }
  
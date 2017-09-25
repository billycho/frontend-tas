import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator,MdSort } from '@angular/material';
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

//Structure
@Component({
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.css']
})
export class PeriodComponent {
 
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  ngOnInit() {
    //this.dataSource = new PeriodDataSource(this.periodDatabase, this.paginator, this.sort);

  }
  
  trainingName: string;
  startDate: Date;
  endDate: string;
  

  dashboardAT: Location[];

  displayedColumns = ['locationId','locationName'];
  periodDatabase;
  dataSource: PeriodDataSource | null;

  constructor(public addPeriod: MdDialog,private locationService:LocationService) {
   // this.periodDatabase = new PeriodDatabase();
    this.locationService.getLocations().subscribe(((dashboardAT) => {
      this.dashboardAT = dashboardAT;
      
      //this.dataSource = new PeriodDataSource(this.periodDatabase, this.paginator, this.sort);
      this.periodDatabase = new PeriodDatabase(this.dashboardAT); 
      this.dataSource = new PeriodDataSource(this.periodDatabase, this.sort);
    }));
  }

  // editDialog(operation:string, period:Period)
  // {
  //   let dialogRef = this.addPeriod.open(AddPeriodDialog, {
  //     width: '40%',
  //     data: { trainingName: period.locationId }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.trainingName = result.trainingName;
  //     this.startDate = result.startDate;
  //     this.endDate = result.endDate;
  //   });
  // }
  // openDialog(operation:string): void {
  
  //   let dialogRef = this.addPeriod.open(AddPeriodDialog, {
  //     width: '40%',
  //     data: { trainingName: "",operation: operation }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.trainingName = result.trainingName;
  //     this.startDate = result.startDate;
  //     this.endDate = result.endDate;
  //   });
  // }

}

//Add Period Component dialog
@Component({
  templateUrl: 'add-period-dialog.html',
  styleUrls: ['./period.component.css']
})
export class AddPeriodDialog {
  addPeriodFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    public dialogRef: MdDialogRef<AddPeriodDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

//table

export class PeriodDatabase {
  dataChange: BehaviorSubject<Location[]> = new BehaviorSubject<Location[]>([]);
  get data(): Location[] { return this.dataChange.value; }

  // constructor() {
  //   this.dataChange.next([
  //     {locationId: 1, locationName: '1'},
  //     {locationId: 2, locationName: "123"}
  //   ]);
  // }

    constructor(private dataAT: Location[]) {
    // ]);
    for (let i = 0; i < dataAT.length; i++) { 
  
      alert( this.dataAT[i].locationName);
      const copiedData = this.data.slice();
      copiedData.push({
        locationId: this.dataAT[i].locationId,
        locationName: this.dataAT[i].locationName
      });
      this.dataChange.next(copiedData);
   }
  }
}

export class PeriodDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) {
    this._filterChange.next(filter);
  }
  filteredData: Location[] = [];
  renderedData: Location[] = [];
  //sortedData: Period[] = [];
  constructor(private _periodDatabase: PeriodDatabase,  private _sort: MdSort) {
    super();
  }
  connect(): Observable<Location[]> {
    const displayDataChanges = [
      this._periodDatabase.dataChange,
      this._filterChange,
      this._sort.mdSortChange,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();

      

    });
  }

  disconnect() {}

  getSortedData(): Location[] {
    const data = this._periodDatabase.data.slice();
    //const data = this._periodDatabase.data.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'locationId': [propertyA, propertyB] = [a.locationId, b.locationId]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
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


//Structure
@Component({
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.css']
})
export class PeriodComponent {
  displayedColumns = ['id','trainingName', 'activeStatus', 'coursesCount', 'startDate', 'endDate', 'createdBy', 'editedBy', 'action'];
  periodDatabase = new PeriodDatabase();
  dataSource: PeriodDataSource | null;

  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  ngOnInit() {
    this.dataSource = new PeriodDataSource(this.periodDatabase, this.paginator, this.sort);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.dataSource) { return; }
          this.dataSource.filter = this.filter.nativeElement.value;
        });
  }
  
  trainingName: string;
  startDate: Date;
  endDate: string;
  

  constructor(public addPeriod: MdDialog) {}

  editDialog(operation:string, period:Period)
  {
    let dialogRef = this.addPeriod.open(AddPeriodDialog, {
      width: '40%',
      data: { trainingName: period.locationId }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.trainingName = result.trainingName;
      this.startDate = result.startDate;
      this.endDate = result.endDate;
    });
  }
  openDialog(operation:string): void {
  
    let dialogRef = this.addPeriod.open(AddPeriodDialog, {
      width: '40%',
      data: { trainingName: "",operation: operation }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.trainingName = result.trainingName;
      this.startDate = result.startDate;
      this.endDate = result.endDate;
    });
  }

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
export interface Period {
  locationId:number;
  locationName: string;
}

export class PeriodDatabase {
  dataChange: BehaviorSubject<Period[]> = new BehaviorSubject<Period[]>([]);
  get data(): Period[] { return this.dataChange.value; }

  constructor() {
    this.dataChange.next([
      {locationId: 1, locationName: '1'},
      {locationId: 2, locationName: "123"}
    ]);
  }
}

export class PeriodDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) {
    this._filterChange.next(filter);
  }
  filteredData: Period[] = [];
  renderedData: Period[] = [];
  //sortedData: Period[] = [];
  constructor(private _periodDatabase: PeriodDatabase, private _paginator: MdPaginator, private _sort: MdSort) {
    super();
  }
  connect(): Observable<Period[]> {
    const displayDataChanges = [
      this._periodDatabase.dataChange,
      this._filterChange,
      this._paginator.page,
      this._sort.mdSortChange,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      this.filteredData = this._periodDatabase.data.slice().filter((item: Period) => {
        let searchStr = (item.locationId + item.locationName).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });

     const sortedData = this.getSortedData(this.filteredData.slice());

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);

      
      return this.renderedData;

      

    });
  }

  disconnect() {}

  getSortedData(data: Period[]): Period[] {
    //const data = this._periodDatabase.data.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.locationId, b.locationId]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
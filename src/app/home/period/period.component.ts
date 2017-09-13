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
      data: { trainingName: period.trainingName, startDate: new Date(period.startDate), endDate:new Date(period.endDate) ,operation: operation }
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
  id:number;
  trainingName: string;
  activeStatus: boolean;
  coursesCount: number;
  startDate: string;
  endDate: string;
  createdBy: string;
  editedBy: string;
}

export class PeriodDatabase {
  dataChange: BehaviorSubject<Period[]> = new BehaviorSubject<Period[]>([]);
  get data(): Period[] { return this.dataChange.value; }

  constructor() {
    this.dataChange.next([
      {id: 1,trainingName: 'Training #1', activeStatus: true , coursesCount: 3 , startDate:'1-11-2017', endDate:'3-12-2017', createdBy:"Trainer #1", editedBy: "Trainer #12"},
      {id: 2,trainingName: 'Training #2', activeStatus: false , coursesCount: 3 , startDate:'2-11-2017', endDate:'4-12-2017', createdBy:"Trainer #2", editedBy: "Trainer #11"},
      {id: 3,trainingName: 'Training #3', activeStatus: true , coursesCount: 3 , startDate:'3-11-2017', endDate:'5-12-2017', createdBy:"Trainer #3", editedBy: "Trainer #10"},
      {id: 4,trainingName: 'Training #4', activeStatus: false , coursesCount: 8 , startDate:'4-11-2016', endDate:'6-12-2016', createdBy:"Trainer #4", editedBy: "Trainer #9"},
         {id: 5,trainingName: 'Training #5', activeStatus: true , coursesCount: 3 , startDate:'5-11-2017', endDate:'7-12-2017', createdBy:"Trainer #5", editedBy: "Trainer #8"},
      {id: 6,trainingName: 'Training #6', activeStatus: false , coursesCount: 3 , startDate:'6-11-2017', endDate:'8-12-2017', createdBy:"Trainer #6", editedBy: "Trainer #7"},
      {id: 7,trainingName: 'Training #7', activeStatus: true , coursesCount: 3 , startDate:'7-11-2017', endDate:'9-12-2017', createdBy:"Trainer #7", editedBy: "Trainer #6"},
      {id: 8,trainingName: 'Training #8', activeStatus: false , coursesCount: 8 , startDate:'8-11-2016', endDate:'10-12-2016', createdBy:"Trainer #8", editedBy: "Trainer #5"},
      {id: 9,trainingName: 'Training #9', activeStatus: true , coursesCount: 3 , startDate:'9-11-2017', endDate:'11-12-2017', createdBy:"Trainer #9", editedBy: "Trainer #4"},
      {id: 10,trainingName: 'Training #10', activeStatus: false , coursesCount: 3 , startDate:'10-11-2017', endDate:'12-12-2017', createdBy:"Trainer #10", editedBy: "Trainer #3"},
      {id: 11,trainingName: 'Training #11', activeStatus: true , coursesCount: 3 , startDate:'11-11-2017', endDate:'13-12-2017', createdBy:"Trainer #11", editedBy: "Trainer #2"},
      {id: 12,trainingName: 'Training #12', activeStatus: false , coursesCount: 8 , startDate:'12-11-2016', endDate:'14-12-2016', createdBy:"Trainer #12", editedBy: "Trainer #1"}
      
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
        let searchStr = (item.trainingName + item.startDate + item.endDate + item.createdBy + item.editedBy).toLowerCase();
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
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
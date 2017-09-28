import { Component, OnInit, ElementRef, Inject, ViewChild} from '@angular/core';
import  {DataSource} from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator,MdSort} from '@angular/material';

import 'rxjs/add/observable/of';

import { AddUserDialog } from './adduserdialog.component'
import { Employee } from '../../model/employee';

import { EmployeeService } from '../../service/employee.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  private users:Employee[];
  dataSource:UserDataSource;
  employeeDatabase;
  
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  
  constructor(
    private employeeService: EmployeeService,
    public addUserDialog: MdDialog
  ) {
    this.updateUser();

    //filtering    
  

  }
  
  displayedColumns = ['employeeId', 'fullname', 'email', 'jobfamily','stream', 'grade', 'accountName', 'active', 'roles', 'act'];
  
  ngOnInit() {
    
  }
  updateUser(){
    this.employeeService.getUsers()
    .subscribe(
      (users)=>{this.users = users; 
      this.employeeDatabase = new EmployeeDatabase(this.users);
      this.paginator._length = this.employeeDatabase.data.length;
      this.paginator.pageSize = 10;
      this.paginator._pageIndex = 0;
      this.dataSource = new UserDataSource(this.employeeDatabase,this.paginator,this.sort);

        Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filter = this.filter.nativeElement.value;
    });

      }
    );
  }
  openDialog(): void {
    let dialogRef = this.addUserDialog.open(AddUserDialog, {
      height: '600px',
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result=>{
      this.updateUser();
    });
  }
}

export class EmployeeDatabase {
  dataChange: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  get data(): Employee[] { return this.dataChange.value; }

  // constructor()
  // {

  // }
  constructor(private dataEmployees:Employee[])
  {
   // alert(dataAT.length);
  
        this.dataChange.next(dataEmployees);
      
  }
}

export class UserDataSource extends DataSource<any> {
  
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
  filteredData: Employee[] = [];
  renderedData: Employee[] = [];
  sortedData: Employee[] = [];
  constructor(private _empDatabase: EmployeeDatabase,  private _paginator: MdPaginator, private _sort: MdSort) {
    super();
  }
  connect(): Observable<Employee[]> {
    const displayDataChanges = [
      this._empDatabase.dataChange,
      this._filterChange,
      this._paginator.page,
      this._sort.mdSortChange,
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      //return this.getSortedData();
    //console.log("ok");
     //console.log(this._paginator.pageIndex);

     this.filteredData = this._empDatabase.data.slice().filter((item: Employee) => {
      let searchStr = (item.accountName).toLowerCase();
      return searchStr.indexOf(this.filter.toLowerCase()) != -1;
    });

     const sortedData = this.getSortedData(this.filteredData.slice());
     const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
     this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);

      return this.renderedData;
     
      

      

    });
  }

  disconnect() {}

  getSortedData(data: Employee[]): Employee[] {
    //const data = this._periodDatabase.data.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'employeeId': [propertyA, propertyB] = [a.employeeId, b.employeeId]; break;
        case 'fullname' : [propertyA, propertyB] = [a.fullname, b.fullname]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
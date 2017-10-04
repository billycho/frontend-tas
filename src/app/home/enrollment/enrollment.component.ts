import { Component, OnInit, ElementRef, Inject, ViewChild} from '@angular/core';
import  {DataSource} from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator,MdSort} from '@angular/material';
import { EmployeeService } from '../../service/employee.service';
import 'rxjs/add/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Course } from '../../model/course';
import {CookieService } from 'angular2-cookie/services/cookies.service';

@Component({
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})
export class EnrollmentComponent implements OnInit {
  courses:any[];
  status:any[];
  currentUser:any;

  dataSource;
  enrolledDatabase;
  displayedColumns = ['courseId', 'trainingname', 'coursename', 'trainer', 'startat','endat', 'status'];
  
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  constructor( private employeeService: EmployeeService,private cookieService:CookieService) { 

    this.currentUser=JSON.parse(this.cookieService.get('currentUserLocalHost'));  
    console.log(this.currentUser.employeeId);   
    this.employeeService.getEnrolledCourse(this.currentUser.employeeId)
    .subscribe(
      (response)=>{
        console.log(response);
        this.courses = response;
        this.employeeService.getEnrolledStatusCourse(this.currentUser.employeeId)
        .subscribe(
          (response)=>{
            console.log(response);
            //this.courses = response;
            for(var i = 0;i<this.courses.length;i++)
            {
                
                this.courses[i]['status'] = response[i];

            } 

            this.enrolledDatabase = new EnrolledDatabase(this.courses);
            this.paginator._length = this.enrolledDatabase.data.length;
            this.paginator.pageSize = 10;
            this.paginator._pageIndex = 0;
            this.dataSource = new EnrolledDataSource(this.enrolledDatabase,this.paginator,this.sort);
      
              Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });
        });
      });

    }
    
  ngOnInit() {
  }

}
export class EnrolledDatabase {
  dataChange: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>([]);
  get data(): Course[] { return this.dataChange.value; }

  // constructor()
  // {

  // }
  constructor(private datas:Course[])
  {
   // alert(dataAT.length);
  
        this.dataChange.next(datas);
      
  }
}

export class EnrolledDataSource extends DataSource<any> {

  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) {
    this._filterChange.next(filter);
  }
  filteredData: Course[] = [];
  renderedData: Course[] = [];
  sortedData: Course[] = [];
  constructor(private _empDatabase: EnrolledDatabase,  private _paginator: MdPaginator, private _sort: MdSort) {
    super();
  }
  connect(): Observable<Course[]> {
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

     this.filteredData = this._empDatabase.data.slice().filter((item: Course) => {
      let searchStr = (item.coursename.coursename).toLowerCase();
      return searchStr.indexOf(this.filter.toLowerCase()) != -1;
    });

     const sortedData = this.getSortedData(this.filteredData.slice());
     const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
     this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);

      return this.renderedData;
     
      

      

    });
  }

  disconnect() {}

  getSortedData(data: Course[]): Course[] {
    //const data = this._periodDatabase.data.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'courseId': [propertyA, propertyB] = [a.courseId, b.courseId]; break;
        case 'coursename' : [propertyA, propertyB] = [a.coursename.coursename, b.coursename.coursename]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}

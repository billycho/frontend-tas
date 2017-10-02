import { Component,ElementRef, OnInit, Inject, ViewChild  } from '@angular/core';
import { PeriodService } from '../../../service/period.service';
import { EmployeeService } from '../../../service/employee.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import {Employee} from '../../../model/employee';
import {EligibleParticipant} from '../../../model/eligible';
import {MdSnackBar} from '@angular/material';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdPaginator,MdSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.component.html'
})
export class EnrollParticipantComponent implements OnInit {
  @ViewChild('filter') filter: ElementRef;
  
     dataSource:EmployeeDataSource;
     empDatabase:EmployeeListDatabase;
     employees:Employee[];
     employeesParticipant:Employee[];
     employeesList:EmployeeList[]=[];
     employeesParticipantList:EmployeeList[]=[];
     displayedColumns = ['isParticipant','employeeId', 'fullname', 'jobfamily','stream', 'grade', 'active'];
     
 constructor(   public dialogEnroll: MdDialogRef<EnrollParticipantComponent>,private periodService:PeriodService,private employeeService:EmployeeService, @Inject(MD_DIALOG_DATA) public dialogData: any, private alertSnackBar:MdSnackBar  ) {
       console.log(dialogData.courseId);
       this.periodService.getParticipantByCourse(dialogData.courseId).subscribe(((response) => {
        
              this.employeesParticipant= response;
              console.log(this.employeesParticipant.length);
        
        
              //get all user
              this.employeeService.getUsers().subscribe(((response) => {
                
                this.employees = response;
                console.log(this.employees.length);
        
                //check already in the list or not
                // console.log(this.employeesEligible[0].fullname);
                // if(this.employees[0].fullname == this.employeesEligible[0].fullname)
                // {
                //   console.log("a"); 
                // }
        
                var i = 0;
                var j = 0;
                for(i = 0;i<this.employeesParticipant.length;i++)
                {
                  this.employeesList[i] = new  EmployeeList(this.employeesParticipant[i],true);
                  this.employeesList[i].beenParticipant = true;
                  console.log("a");
                  console.log(this.employeesList[i].beenParticipant);
        
                  this.employees = this.employees.filter(item => item.fullname != this.employeesParticipant[i].fullname);  
                  j = j + 1;
                }
        
                for(i = 0;i<this.employees.length;i++)
                {
                  this.employeesList[j] = new  EmployeeList(this.employees[i],false);
                  j = j+1;          
                }
                
                //console.log(j);
                
                this.empDatabase = new EmployeeListDatabase(this.employeesList);
                this.dataSource = new EmployeeDataSource(this.empDatabase);
        
        
                //searching
                Observable.fromEvent(this.filter.nativeElement, 'keyup')
                .debounceTime(150)
                .distinctUntilChanged()
                .subscribe(() => {
                  if (!this.dataSource) { return; }
            
                  this.dataSource.filter = this.filter.nativeElement.value;
                  console.log(this.dataSource.filter);
                });
                
               }));
        
             })); 
   }

  ngOnInit() {
  }

  closeDialog(){
    this.dialogEnroll.close();
}

enroll()
{
   console.log("asda");
   var i = 0;
   for(i = 0;i<this.employeesList.length;i++)
    {
      if(this.employeesList[i].isParticipant && !this.employeesList[i].beenParticipant)
      {
          var  eligible = new EligibleParticipant();
          eligible.trainingPeriodId = this.dialogData.courseId;
          eligible.employeeId = this.employeesList[i].employee.employeeId;
          this.periodService.addEnrolledParticipant(eligible).subscribe(((response) => {

          }));  
          
      }
      else if(!this.employeesList[i].isParticipant && this.employeesList[i].beenParticipant)
      {
        var  eligible = new EligibleParticipant();
        eligible.trainingPeriodId = this.dialogData.courseId;
        eligible.employeeId = this.employeesList[i].employee.employeeId;
        this.periodService.deleteEnrolledParticipant(eligible).subscribe(((response) => {
          
        }));  
      }
               
    }
    this.alertSnackBar.open("Enrolled participant modified",'', {
      duration:3000
    });
    this.closeDialog();
}

  
  

}

class EmployeeList
{
  public beenParticipant:boolean;
  public isParticipant:boolean;
  
  constructor(
      public employee:Employee, isParticipant:boolean
  ){
    
      this.isParticipant = isParticipant;
      this.beenParticipant = false;
      
   }
}

export class EmployeeListDatabase {
  dataChange: BehaviorSubject<EmployeeList[]> = new BehaviorSubject<EmployeeList[]>([]);
  get data(): EmployeeList[] { return this.dataChange.value; }

  // constructor()
  // {

  // }
  constructor(private employeesList: EmployeeList[])
  {
   // alert(dataAT.length);
  
        this.dataChange.next(employeesList);
      
  }
}


export class EmployeeDataSource extends DataSource<any> {
  constructor( private _empDatabase: EmployeeListDatabase){
      super();
  }
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) {
    this._filterChange.next(filter);
  }
  filteredData: EmployeeList[] = [];

  connect(): Observable<EmployeeList[]> {
    const displayDataChanges = [
      this._empDatabase.dataChange,
      this._filterChange
    ];


    return Observable.merge(...displayDataChanges).map(() => {
      //return this.getSortedData();
    //console.log("ok");
     //console.log(this._paginator.pageIndex);

     this.filteredData = this._empDatabase.data.slice().filter((item: EmployeeList) => {
      let searchStr = (item.employee.fullname).toLowerCase();
      return searchStr.indexOf(this.filter.toLowerCase()) != -1;
    });

     
      return this.filteredData;
     
      

      

    });
  }

  

  disconnect() {}
  }



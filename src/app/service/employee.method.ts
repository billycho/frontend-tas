import { Injectable }  from '@angular/core';
import { Employee } from "../model/employee";
import { Role } from "../model/role";

@Injectable()
export class EmployeeMethod{
constructor(
        private employee: Employee
){

}
//IF EXIST RETURN THE INDEX IF NOT RETURN MINUS
public searchRole(role:Role):number{
    var i:number=0;
    var result:number=-723;

    for (i=0; i < this.employee.roles.length; i++){
        if (role.roleId == this.employee.roles[i].roleId){
                result = i;
                }
        }
    return result;
    }

public deleteRole(role:Role){
    var index:number =this.searchRole(role);
    if(index >=0){
        this.employee.roles.splice(index,1);
            // this.employee.roles = this.employee.roles.filter(role => role[index] != role);
        }
    }

public insertRole(role:Role){
    var index:number =this.searchRole(role);
    if(index < 0){
            this.employee.roles[this.employee.roles.length] = role;
            }
    }
}
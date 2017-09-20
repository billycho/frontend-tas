// import {Employee} from "./employee"
import {Role} from "./role"
import {Grade } from "./grade"

export interface User{
        // employee:Employee;
        // roles: Role[];
        employeeId:number;
        fullname:string;
        grade: Grade;
        stream: String;
        active: boolean;
        location: Location;
        accountName: String;
        email: String;
        accountPassword: String;
        salt: String;
        roles:Array<Role>;
}
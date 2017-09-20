import { Location } from "../../location";
import { Grade } from "./grade"
import { Role } from "./role"

export interface Employee{
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
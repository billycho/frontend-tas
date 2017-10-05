import { Location } from "./location";
import { Grade } from "./grade"
import { Role } from "./role"

export class Employee{
        
        public employeeId:number
        public fullname:string
        public grade: Grade
        public stream: String
        public active: boolean
        public location: Location
        public accountName: String
        public email: String
        public accountPassword: String
        public salt: String
        public roles:Array<Role>
        
}

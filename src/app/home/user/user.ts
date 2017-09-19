import {Employee} from "./employee"
import {Role} from "./Role"

export class User{
    constructor (
        public employee:Employee,
        public roles: Role[]
    ){    
    }
}
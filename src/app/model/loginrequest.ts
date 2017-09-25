export class LoginRequest{
    constructor (
        public employeeId:number,
        public status:number,
        public role:number,
        public name:string
    ){    
    }
}
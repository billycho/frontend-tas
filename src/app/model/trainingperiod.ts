import { Employee } from "./employee";

export class TrainingPeriod{
        public trainingPeriodId:number;
        public periodName:String;
        public startDate: Date;
        public endDate: Date;
        public creatorId: Employee;
        public createdDate: Date;
        public updaterId: Employee;
        public updatedDate: Date;
        public periodical: boolean;
        public openenrollment: boolean;
        public employee:Employee;
        constructor(
        ){}
}
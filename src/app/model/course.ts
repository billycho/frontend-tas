import {Coursename} from './coursename';
import {TrainingPeriod} from './trainingperiod';
import {Employee} from './employee';

export class Course{
    constructor(
        public courseId: number,
        public coursename: Coursename,
        public trainingPeriod: TrainingPeriod,
        public capacity:number,
        public mainTrainer: Employee,
        public backUpTrainer: Employee,
        public courseSchedule: any[]
    ){

    }
}
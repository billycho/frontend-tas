import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Location } from "./location";
 
@Injectable()
export class LocationService {
   constructor(private http: Http) {
   }
 
   getLocations(): Observable<Location[]> {
      
      return this.http.get("http://localhost:8080/locations")
         .map((res: Response) => res.json())
         .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
   }
}
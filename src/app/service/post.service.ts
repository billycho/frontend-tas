import {Injectable} from "@angular/core";
import {Post} from '../model/post';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PostService {
    constructor (private http: Http) {}
    getData (): Promise<Post[]> {

      // return this.http.get(this.heroesUrl)
      // .toPromise()
      // .then(response => response.json().data as User[])
      // .catch(this.handleError);
      
      console.log(this.http.get('http://jsonplaceholder.typicode.com/posts/')
      .toPromise()
      .then(response => response.json().data as Post[])
      .catch(this.handleError));

      return null;
      
    }
    private extractData(res: Response) {
        let body = res.json();
        return body || [];
    }
    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
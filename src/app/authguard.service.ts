import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { CookieService } from 'angular2-cookie/services/cookies.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
    private cookieService: CookieService
    ){ }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // if (localStorage.getItem('currentUser')) {
            if(this.cookieService.get('currentUserLocalHost')){
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']
        , { queryParams: { returnUrl: state.url }}
        );
        return false;
    }
}
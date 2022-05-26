import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'angular2-cookie/core';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(
		private cookieService: CookieService,
		private router: Router
	) { }
	canActivate() {
		if (this.cookieService.get('loginResponce')) {
			return true;
		} else {
			this.router.navigate(['/Login']);
			return false;
		}
	}
}

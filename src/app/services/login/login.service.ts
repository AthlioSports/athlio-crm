import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../apiUrls';

import { map, filter, catchError, mergeMap } from 'rxjs/operators';



@Injectable({
	providedIn: 'root'
})
export class LoginService {
	constructor(private httpClient: HttpClient) { }
	login(loginDetails) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'super_users/login', loginDetails)
			.pipe(
				map((res: any) => res)
			);
	}
	getAcademyOtp(loginDetails) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'academies/sendOtp', loginDetails)
			.pipe(
				map((res: any) => res)
			);
	}

	getParentAcademyOtp(loginDetails) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'parent_academies/sendOtp', loginDetails)
			.pipe(
				map((res: any) => res)
			);
	}

	academyLogin(loginDetails) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'academies/submitOtp', loginDetails)
			.pipe(
				map((res: any) => res)
			);
	}

	academyLoginWithEmail(loginDetails) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'academies/loginWithEmail', loginDetails)
			.pipe(
				map((res: any) => res)
			);
	}
	academyParentLoginWithEmail(loginDetails) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'parent_academies/loginWithEmail', loginDetails)
			.pipe(
				map((res: any) => res)
			);
	}

	ForgotPassword(loginDetails) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'academies/forgotpassword', loginDetails)
			.pipe(
				map((res: any) => res)
			);
	}
	forgotParentpassword(loginDetails) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'parent_academies/forgotpassword', loginDetails)
			.pipe(
				map((res: any) => res)
			);
	}

	loginParentWithOtp(loginDetails) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'parent_academies/submitOtp', loginDetails)
			.pipe(
				map((res: any) => res)
			);
	}
}

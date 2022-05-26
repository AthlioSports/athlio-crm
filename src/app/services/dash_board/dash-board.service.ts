import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions } from '@angular/http';
import { AppSettings } from '../../apiUrls';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class DashBoardService {

	constructor(private httpClient: HttpClient) { }
	getCounts(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'super_users/dashBoardCounts', data)
			.pipe(
				map((res: Response) => res)
			);
	}
	getParentAcademyDashBoardCounts(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'super_users/getParentAcademyDashBoardCounts', data)
			.pipe(
				map((res: Response) => res)
			);
	}
	getSportsBachesCounts(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'super_users/dashBoardSportsBatchesCounts', data)
			.pipe(
				map((res: Response) => res)
			);
	}
	getStudentsDataByAgeGroup(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'students/getStudentsDataByAgeGroup', data)
			.pipe(
				map((res: Response) => res)
			);
	}
	getStudentsPerBatchPerSport(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'super_users/getStudentsPerBatchPerSport', data)
			.pipe(
				map((res: Response) => res)
			);
	}
	getAcademiesList() {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'academies/getAcademiesList', {})
			.pipe(
				map((res: Response) => res)
			);
	}
	getStudentsPersportPerBatch(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'students/getStudentsByBatch', data)
			.pipe(
				map((res: Response) => res)
			);
	}
	getRevenuePerSport(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'studentPayments/getRevenuePerSport', data)
			.pipe(
				map((res: Response) => res)
			);
	}
	getStudentsPerMonthByYear(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'students/getStudentsPerMonthByYear', data)
			.pipe(
				map((res: Response) => res)
			);
	}
	getStudentsPerSportByGender(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'students/getStudentsPerSportByGender', data)
			.pipe(
				map((res: Response) => res)
			);
	}
	getPieChartData(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'students/getStudentsPerSport', data)
			.pipe(
				map((res: Response) => res)
			);
	}
	getBranchAcademies(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'parent_academies/getBranchAcademies', data)
			.pipe(
				map((res: Response) => res)
			);
	}
}

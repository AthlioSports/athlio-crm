import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
				map((res: any) => res)
			);
	}
	getParentAcademyDashBoardCounts(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'super_users/getParentAcademyDashBoardCounts', data)
			.pipe(
				map((res: any) => res)
			);
	}
	getSportsBachesCounts(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'super_users/dashBoardSportsBatchesCounts', data)
			.pipe(
				map((res: any) => res)
			);
	}
	getStudentsDataByAgeGroup(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'students/getStudentsDataByAgeGroup', data)
			.pipe(
				map((res: any) => res)
			);
	}
	getStudentsPerBatchPerSport(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'super_users/getStudentsPerBatchPerSport', data)
			.pipe(
				map((res: any) => res)
			);
	}
	getAcademiesList() {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'academies/getAcademiesList', {})
			.pipe(
				map((res: any) => res)
			);
	}
	getStudentsPersportPerBatch(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'students/getStudentsByBatch', data)
			.pipe(
				map((res: any) => res)
			);
	}
	getRevenuePerSport(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'studentPayments/getRevenuePerSport', data)
			.pipe(
				map((res: any) => res)
			);
	}
	getStudentsPerMonthByYear(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'students/getStudentsPerMonthByYear', data)
			.pipe(
				map((res: any) => res)
			);
	}
	getStudentsPerSportByGender(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'students/getStudentsPerSportByGender', data)
			.pipe(
				map((res: any) => res)
			);
	}
	getPieChartData(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'students/getStudentsPerSport', data)
			.pipe(
				map((res: any) => res)
			);
	}
	getBranchAcademies(data) {
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'parent_academies/getBranchAcademies', data)
			.pipe(
				map((res: any) => res)
			);
	}
}

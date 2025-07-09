import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { AppSettings } from '../../apiUrls';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private httpClient : HttpClient) { }
  
  getStudentDetails(studetId){
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'students/getDetails',{id : studetId})
		.pipe(
			map((res: any) => res)
		);
	}
	saveStudent(studentData){
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'students/create_student',studentData)
		.pipe(
			map((res: any) => res)
		);
  }
  studentsBulkUpload(studentData){
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'super_users/studentsBulkUpload',studentData)
		.pipe(
			map((res: any) => res)
		);
  }
  downloadBulkUploadTemplate(){
		return this.httpClient.get(AppSettings.API_ENDPOINT + 'super_users/sendStudentBulkUploadTemplate');
	}
	deleteStudent(id){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'students/deleteStudent?id='+id,{})
    .pipe(
      map((res: any) => res)
    );  
  }
  updateStudentsPaymentsStatus(data){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'studentPayments/payPendingFee',data)
    .pipe(
      map((res: any) => res)
    );
  }
	updateDetails(updateObj){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'students/updateDetails',updateObj)
    .pipe(
      map((res: any) => res)
    );
  }
  getAcademyStudentsFeeData(data){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'studentPayments/getAcademyStudentsFeePayments',data)
    .pipe(
      map((res: any) => res)
    );
  }
}

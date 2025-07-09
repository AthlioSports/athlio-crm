import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { AppSettings } from '../../apiUrls';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SuperUserService {

  constructor(private httpClient : HttpClient) { }
  getSuperUserDetails(superUserId){
		return this.httpClient.get(AppSettings.API_ENDPOINT + 'super_users/getDetails?id='+superUserId)
		.pipe(
			map((res: any) => res)
		);
	}
	updateDetails(updateData){
		return this.httpClient.put(AppSettings.API_ENDPOINT + 'super_users/updateDetails',updateData)
		.pipe(
			map((res: any) => res)
		);
	}
}

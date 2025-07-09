import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { AppSettings } from '../../apiUrls';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoachService {

  constructor(private httpClient : HttpClient) { }
  getAcademyMaterCoaches(academyId){
  	return this.httpClient.post(AppSettings.API_ENDPOINT + 'coaches/getCoachesList',{academy : academyId,chief_coach : true})
	  .pipe(
	    map((res: any) => res)
	  );
  }
  getAcademyCoaches(academyId){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'coaches/getCoachesList',{academy : academyId})
    .pipe(
      map((res: any) => res)
    );
  }
  getAcademySportCoaches(academyId,sportId){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'coaches/getCoachesList',{academy : academyId,sport:sportId})
    .pipe(
      map((res: any) => res)
    );
  }
  deleteCoach(id){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'coaches/deleteCoach?id='+id,{})
    .pipe(
      map((res: any) => res)
    );  
  }
  saveCoach(coachData){
  	return this.httpClient.post(AppSettings.API_ENDPOINT + 'coaches',coachData)
	  .pipe(
	    map((res: any) => res)
	  );
  }
  updateDetails(updateObj){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'coaches/updateDetails',updateObj)
    .pipe(
      map((res: any) => res)
    );
  }
  getAllCoaches(){
  	return this.httpClient.post(AppSettings.API_ENDPOINT + 'coaches/getCoachesList',{academy : 'All'})
	  .pipe(
	    map((res: any) => res)
	  );
	}
	
	getCoachDetails(coachId){
		return this.httpClient.post(AppSettings.API_ENDPOINT + 'coaches/getCoachesList',{id : coachId})
		.pipe(
			map((res: any) => res)
		);
	}

	getBathes(coachId){
    return this.httpClient.get(AppSettings.API_ENDPOINT + 'coaches/getBatches?id='+coachId)
    .pipe(
      map((res: any) => res)
    );
  }
  
  getAllBathes(){
    return this.httpClient.get(AppSettings.API_ENDPOINT + 'student_batches')
    .pipe(
      map((res: any) => res)
    );
  }

  checkForDuplicateCoachesWithEmAilOrMobile(data){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'coaches/checkForDuplicateCoachesWithEmAilOrMobile', data)
    .pipe(
      map((res: any) => res)
    );
	}
}
  
  // coaches/getBatches?id=5c503de57ac6e3117038d69a


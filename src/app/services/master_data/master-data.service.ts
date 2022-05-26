import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Http, Response, RequestOptions } from '@angular/http';
import { AppSettings } from '../../apiUrls';

import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  constructor(private httpClient: HttpClient) { }
  changeLoggedUser = new Subject();
  getSports(){
  	return this.httpClient.get(AppSettings.API_ENDPOINT + 'sports')
	  .pipe(
	    map((res: Response) => res)
	  );
  }
  getAmenities(){
  	return this.httpClient.post(AppSettings.API_ENDPOINT + 'aminities/getAmenities', {})
	  .pipe(
	    map((res: Response) => res)
	  );
  }
  getBlogCategories(){
  	return this.httpClient.get(AppSettings.API_ENDPOINT + 'blogCategories')
	  .pipe(
	    map((res: Response) => res)
	  );
  }
  addSport(data){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'sports', data)
    .pipe(
      map((res: Response) => res)
    );
  }
  addBlog(data){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'blogs', data)
    .pipe(
      map((res: Response) => res)
    );
  }
  updateSport(updateObj){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'sports/updateSport', updateObj)
    .pipe(
      map((res: Response) => res)
    );
  }
  deleteSport(id){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'sports/deleteSport?id='+id,{})
    .pipe(
      map((res: Response) => res)
    );  
  }
  getDays(){
  	return this.httpClient.get(AppSettings.API_ENDPOINT + 'days')
	  .pipe(
	    map((res: Response) => res)
	  );
  }
  getCourts(sportId){
  	return this.httpClient.get(AppSettings.API_ENDPOINT + 'courts/getCourtsListForSport?id='+sportId)
	  .pipe(
	    map((res: Response) => res)
	  );
  }
  updateCourts(updateObj){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'courts/updateCourt', updateObj)
    .pipe(
      map((res: Response) => res)
    );
  }
  deleteCourt(id){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'courts/deleteCourt?id='+id,{})
    .pipe(
      map((res: Response) => res)
    );  
  }
  getCoachLevels(){
    return this.httpClient.get(AppSettings.API_ENDPOINT + 'coach_levels')
    .pipe(
      map((res: Response) => res)
    );
  }
  getAllBatches(){
    return this.httpClient.get(AppSettings.API_ENDPOINT + 'student_batches')
    .pipe(
      map((res: Response) => res)
    );
  }
  getAllCourts(){
    return this.httpClient.get(AppSettings.API_ENDPOINT + 'courts/getAllCourtsList')
    .pipe(
      map((res: Response) => res)
    );
  }
  addCourt(courtData){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'courts',courtData)
    .pipe(
      map((res: Response) => res)
    );
  }
  uploadPic(formData) {
    return this.httpClient.post(AppSettings.API_ENDPOINT + `images/athliovideos/upload`, formData)
    .pipe(
      map((res: Response) => res)
    );
  }

  addSportbatches(batchName){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'student_batches', {name : batchName})
    .pipe(
      map((res: Response) => res)
    );
  }

  updatebatchSport(updateObj){
    return this.httpClient.patch(AppSettings.API_ENDPOINT + 'student_batches/', updateObj)
    .pipe(
      map((res: Response) => res)
    );
  }

  deletebatchsport(id){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'student_batches/deleteStudentBatch',{"batchId": id})
    .pipe(
      map((res: Response) => res)
    );  
  }


  getBlogDetails(data){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'blogs/getBlogDetails', data)
    .pipe(
      map((res: Response) => res)
    );
  }

  getAcademiesList(){
    return this.httpClient.get(AppSettings.API_ENDPOINT + '/academies/getAcademiesList')
    .pipe(
      map((res: Response) => res)
    );  
  }

  
  
  deleteBlog(id) {
		return this.httpClient.put(AppSettings.API_ENDPOINT + 'blogs/deleteBlog?id=' + id, {})
			.pipe(
				map((res: Response) => res)
			);
  }
  
  updateBlogDetails(updateObj) {
		return this.httpClient.put(AppSettings.API_ENDPOINT + 'blogs/updateBlog', updateObj)
			.pipe(
				map((res: Response) => res)
			);
  }
  

  addamenity(data){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'aminities', data)
    .pipe(
      map((res: Response) => res)
    );
  }

  deleteAmenity(data){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'aminities/deleteAmenity', data)
    .pipe(
      map((res: Response) => res)
    );
  }

  updateamenity(updateObj){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'aminities/updateAminity', updateObj)
    .pipe(
      map((res: Response) => res)
    );
  }

}



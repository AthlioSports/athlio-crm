import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
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
	    map((res: any) => res)
	  );
  }
  getAmenities(){
  	return this.httpClient.post(AppSettings.API_ENDPOINT + 'aminities/getAmenities', {})
	  .pipe(
	    map((res: any) => res)
	  );
  }
  getBlogCategories(){
  	return this.httpClient.get(AppSettings.API_ENDPOINT + 'blogCategories')
	  .pipe(
	    map((res: any) => res)
	  );
  }
  addSport(data){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'sports', data)
    .pipe(
      map((res: any) => res)
    );
  }
  addBlog(data){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'blogs', data)
    .pipe(
      map((res: any) => res)
    );
  }
  updateSport(updateObj){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'sports/updateSport', updateObj)
    .pipe(
      map((res: any) => res)
    );
  }
  deleteSport(id){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'sports/deleteSport?id='+id,{})
    .pipe(
      map((res: any) => res)
    );  
  }
  getDays(){
  	return this.httpClient.get(AppSettings.API_ENDPOINT + 'days')
	  .pipe(
	    map((res: any) => res)
	  );
  }
  getCourts(sportId){
  	return this.httpClient.get(AppSettings.API_ENDPOINT + 'courts/getCourtsListForSport?id='+sportId)
	  .pipe(
	    map((res: any) => res)
	  );
  }
  updateCourts(updateObj){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'courts/updateCourt', updateObj)
    .pipe(
      map((res: any) => res)
    );
  }
  deleteCourt(id){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'courts/deleteCourt?id='+id,{})
    .pipe(
      map((res: any) => res)
    );  
  }
  getCoachLevels(){
    return this.httpClient.get(AppSettings.API_ENDPOINT + 'coach_levels')
    .pipe(
      map((res: any) => res)
    );
  }
  getAllBatches(){
    return this.httpClient.get(AppSettings.API_ENDPOINT + 'student_batches')
    .pipe(
      map((res: any) => res)
    );
  }
  getAllCourts(){
    return this.httpClient.get(AppSettings.API_ENDPOINT + 'courts/getAllCourtsList')
    .pipe(
      map((res: any) => res)
    );
  }
  addCourt(courtData){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'courts',courtData)
    .pipe(
      map((res: any) => res)
    );
  }
  uploadPic(formData) {
    return this.httpClient.post(AppSettings.API_ENDPOINT + `images/athliovideos/upload`, formData)
    .pipe(
      map((res: any) => res)
    );
  }

  addSportbatches(batchName){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'student_batches', {name : batchName})
    .pipe(
      map((res: any) => res)
    );
  }

  updatebatchSport(updateObj){
    return this.httpClient.patch(AppSettings.API_ENDPOINT + 'student_batches/', updateObj)
    .pipe(
      map((res: any) => res)
    );
  }

  deletebatchsport(id){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'student_batches/deleteStudentBatch',{"batchId": id})
    .pipe(
      map((res: any) => res)
    );  
  }


  getBlogDetails(data){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'blogs/getBlogDetails', data)
    .pipe(
      map((res: any) => res)
    );
  }

  getAcademiesList(){
    return this.httpClient.get(AppSettings.API_ENDPOINT + '/academies/getAcademiesList')
    .pipe(
      map((res: any) => res)
    );  
  }

  
  
  deleteBlog(id) {
		return this.httpClient.put(AppSettings.API_ENDPOINT + 'blogs/deleteBlog?id=' + id, {})
			.pipe(
				map((res: any) => res)
			);
  }
  
  updateBlogDetails(updateObj) {
		return this.httpClient.put(AppSettings.API_ENDPOINT + 'blogs/updateBlog', updateObj)
			.pipe(
				map((res: any) => res)
			);
  }
  

  addamenity(data){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'aminities', data)
    .pipe(
      map((res: any) => res)
    );
  }

  deleteAmenity(data){
    return this.httpClient.post(AppSettings.API_ENDPOINT + 'aminities/deleteAmenity', data)
    .pipe(
      map((res: any) => res)
    );
  }

  updateamenity(updateObj){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'aminities/updateAminity', updateObj)
    .pipe(
      map((res: any) => res)
    );
  }

}



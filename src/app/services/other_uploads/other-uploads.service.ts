import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { AppSettings } from '../../apiUrls';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OtherUploadsService {

  constructor(private httpClient: HttpClient) { }
  saveOtherUpload(otherUploadData){
  	return this.httpClient.post(AppSettings.API_ENDPOINT + 'other_uploads',otherUploadData)
	  .pipe(
	    map((res: any) => res)
	  );
  }
  getOtherUpload(getObject){
  	return this.httpClient.post(AppSettings.API_ENDPOINT + 'other_uploads/getList',getObject)
	  .pipe(
	    map((res: any) => res)
	  );
  }
  deleteOtherUpload(id){
  	return this.httpClient.put(AppSettings.API_ENDPOINT + 'other_uploads/deleteUpload?id='+id,{})
	  .pipe(
	    map((res: any) => res)
	  );
  }
  updateOtherUpload(data){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'other_uploads/updateDetails',data)
    .pipe(
      map((res: any) => res)
    );
  }
}

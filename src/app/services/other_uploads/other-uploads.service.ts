import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Http, Response, RequestOptions } from '@angular/http';
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
	    map((res: Response) => res)
	  );
  }
  getOtherUpload(getObject){
  	return this.httpClient.post(AppSettings.API_ENDPOINT + 'other_uploads/getList',getObject)
	  .pipe(
	    map((res: Response) => res)
	  );
  }
  deleteOtherUpload(id){
  	return this.httpClient.put(AppSettings.API_ENDPOINT + 'other_uploads/deleteUpload?id='+id,{})
	  .pipe(
	    map((res: Response) => res)
	  );
  }
  updateOtherUpload(data){
    return this.httpClient.put(AppSettings.API_ENDPOINT + 'other_uploads/updateDetails',data)
    .pipe(
      map((res: Response) => res)
    );
  }
}

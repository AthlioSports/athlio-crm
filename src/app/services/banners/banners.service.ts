import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { AppSettings } from '../../apiUrls';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BannersService {

  constructor(private httpClient : HttpClient) { }
  saveBanner(advertaismentsData){
  	return this.httpClient.post(AppSettings.API_ENDPOINT + 'advertaisments',advertaismentsData)
	  .pipe(
	    map((res: any) => res)
	  );
  }
  getAllBanner(){
  	return this.httpClient.get(AppSettings.API_ENDPOINT + 'advertaisments/getAllBanners')
	  .pipe(
	    map((res: any) => res)
	  );
  }
  removeBanner(id){
    return this.httpClient.delete(AppSettings.API_ENDPOINT + '/advertaisments/'+id)
    .pipe(
      map((res: any) => res)
    );
  }
}

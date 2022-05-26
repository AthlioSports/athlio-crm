import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  constructor() { }

  alphabetsOnly(e){
    var keyCode = (e.keyCode ? e.keyCode : e.which);
    if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) ){
        return true
    }
    return false;
  }

  alphabetsAndDotOnly(e){
    var keyCode = (e.keyCode ? e.keyCode : e.which);
    if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || keyCode === 46 ){
        return true
    }
    return false;
  }

  alphabetsAndSpaceOnly(e){
    var keyCode = (e.keyCode ? e.keyCode : e.which);
    if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || keyCode === 32 ){
        return true
    }
    return false;
  }

  alphabets_Space_NumberOnly(e){
    var keyCode = (e.keyCode ? e.keyCode : e.which);
    if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || keyCode === 32 || (keyCode >= 48 && keyCode <= 57)){
        return true
    }
    return false;
  }

  alphabets_dot_space_only(e){
    var keyCode = (e.keyCode ? e.keyCode : e.which);
    if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || keyCode === 46 || keyCode === 32 ){
        return true
    }
    return false;
  }

  alphabets_dot_space_number_only(e){
    var keyCode = (e.keyCode ? e.keyCode : e.which);
    if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || keyCode === 46 || keyCode === 32 || (keyCode >= 48 && keyCode <= 57) ){
        return true
    }
    return false;
  }

  alphabetsAndNumberOnly(e){
    var keyCode = (e.keyCode ? e.keyCode : e.which);
    if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (keyCode >= 48 && keyCode <= 57) ){
        return true
    }
    return false;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}

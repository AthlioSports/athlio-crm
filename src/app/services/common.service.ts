import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CommonService {

	constructor() { }


	validateEmail(mail) {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
			return (true)
		}
		//alert("You have entered an invalid email address!")
		return (false)
	}

	validateMobileNumber(number) {
		if (number.length == 10) {
			var numberArr = number.split("");
			if (numberArr[0] == "9" || numberArr[0] == "8" || numberArr[0] == "7" || numberArr[0] == "6") {
				return true;
			}
		} else {
			return false;
		}
	}

}



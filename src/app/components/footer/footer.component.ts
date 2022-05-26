import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule , Router} from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { MasterDataService } from '../../services/master_data/master-data.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
	// showFooter :boolean= false;
  constructor(private router: Router, private cookieService : CookieService, private masterDataService : MasterDataService) {
	}
  displayFooter : any = false;
  userDetails : any = {};
  ngOnInit() {
  	/*this.router.events.subscribe((event) => {
  	});*/
    /*this.masterDataService.changeLoggedUser.subscribe((data)=>{
      this.displayFooter = true;
    });*/
    this.userDetails = this.cookieService.getObject('loginResponce');
    this.masterDataService.changeLoggedUser.subscribe((data)=>{
      this.userDetails = this.cookieService.getObject('loginResponce');
      this.displayFooter = true;
    });
    if(this.userDetails && this.userDetails.id){
      this.displayFooter = true;
    }
  }
}

import { Component, OnInit, HostListener } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { UserIdleService } from 'angular-user-idle';
import { Router } from '@angular/router';
import { Title }     from '@angular/platform-browser';
import { AcademyService } from './../../services/academy/academy.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {
  readonly googlePlayLink: string;
  readonly appStoreLink: string;
  constructor(
    private cookieService:CookieService,
    private userIdle: UserIdleService,
    private router:Router,
    private titleService: Title,
    private academyService: AcademyService
    ) { }
    public setTitle( newTitle: string) {
      this.titleService.setTitle( newTitle );
    }
  academyLogin : boolean = false;
  userDetails : any = {};
  parentAcademyLogin = false;
  ngOnInit() {
  	this.userDetails = this.cookieService.getObject('loginResponce');
    if(this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'academyadmin'){
      this.academyLogin = true;      
    }else if (this.userDetails && this.userDetails.type && this.userDetails.type.toLowerCase() == 'parentacademy') {
      this.parentAcademyLogin = true;
    }

    //Start watching for user inactivity.
    this.userIdle.startWatching();
    
    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => console.log(count));
    
    // Start watch when time is up.

    this.userIdle.onTimeout().subscribe(() => {
      this.cookieService.removeAll();
      if (this.userDetails && this.userDetails.type && (this.userDetails.type.toLowerCase() == 'academyadmin' || this.userDetails.type.toLowerCase() == 'parentacademy')) {
        this.router.navigate(['/Login']);
      }else {
        this.router.navigate(['/superAdmin/Login']);
      }
      this.cookieService.removeAll();
    });

  }

  stop() {
    this.userIdle.stopTimer();
  }
 
  stopWatching() {
    this.userIdle.stopWatching();
  }
 
  startWatching() {
    this.userIdle.startWatching();
  }
 
  restart() {
    this.userIdle.resetTimer();
  }
  
  getSports(){

  }
  getBlogCategories(){
    
  }

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(e) {
    this.restart();
  }

}

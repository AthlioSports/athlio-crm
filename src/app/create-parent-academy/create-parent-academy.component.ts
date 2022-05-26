import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AcademyService } from './../services/academy/academy.service';
import { Routes, ActivatedRoute, RouterModule, Router } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatToolbarModule, MatTooltipModule } from "@angular/material";
import { CookieService } from 'angular2-cookie/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../Utilities/date.datepicker';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { CommonService } from './../services/common.service';
import { FormControl } from '@angular/forms'
import imageCompression from 'browser-image-compression';
import { NgxSpinnerService } from "ngx-spinner";
import { } from "googlemaps"; // to make this work need to edit this file node_modules\@types\googlemaps/index.d.ts   place declare module 'googlemaps';
import { ValidationsService } from './../services/validations/validations.service';
import {FormCanDeactivate} from '../form-can-deactivate/form-can-deactivate';
import {NgForm} from "@angular/forms";
declare var google: any;
declare var $: JQueryStatic;
@Component({
  selector: 'app-create-parent-academy',
  templateUrl: './create-parent-academy.component.html',
  styleUrls: ['./create-parent-academy.component.css'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class CreateParentAcademyComponent extends FormCanDeactivate implements OnInit {
  @ViewChild('aF') form: NgForm;

  constructor(
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private toastr: ToastrService,
    private router: Router,
    // private masterDataService: MasterDataService,
    private academyService: AcademyService,
    private cookieService: CookieService,
    public activatedRoute: ActivatedRoute,
    // private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private validationsService: ValidationsService,
    private commonService : CommonService
  ) {
    super()
   }


  

  @ViewChild("search")
  public searchElementRef: ElementRef;
  title: string = 'My first AGM project';
  lat: number = 17.387140;
  lng: number = 78.491684;
  zoom: number = 12;
  event: any = {
    coords: {
      lat: 0,
      lng: 0
    }
  }

  updateAcademyDetails: any = {};
  showCreateForm: boolean = true;
  formData: any = {};
  userDetails: any = {};
  geoCoder: any;
  disableInputs: boolean = false;
  now = new Date();
  checkIfSubmit: boolean = false;
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.type === "EDIT") {
        this.disableInputs = false;
      } else if(params.type === "VIEW") {
        this.disableInputs = true;
      }
    });
    if (this.activatedRoute.snapshot.params.academyId) {
      this.academyService.getParentAcademyDetails({ id: this.activatedRoute.snapshot.params.academyId}).subscribe((data: any) => {
        this.formData = data.data;
      }, error => {
        this.toastr.success('No data found.');
      });
    }
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["(regions)"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 12;
          if (!this.activatedRoute.snapshot.params.academyId) {
            this.formData.location = {};
            this.formData.location.type = "Point";
            this.formData.location.coordinates = [this.event.coords.lat, this.event.coords.lng];
          } else {
            this.updateAcademyDetails.location.coordinates = [this.event.coords.lat, this.event.coords.lng];
          }
        });
      });
    });
    this.onActivate(event);
  }

  onActivate(event) {
    window.scroll(0, 0);
  }
  editData(id) {
    this.router.navigate(['/Sidemenu/parent-academy/create-parentAcademy/' + this.activatedRoute.snapshot.params.academyId], { queryParams: { type: 'EDIT'} });
  }
  updateParentAcademy(){
    if (!this.formData.name) {
      this.toastr.error('Academy name is a mandatory field.');
      return;
    }
    if (!this.formData.name || this.formData.name.length < 3) {
      this.toastr.error('Academy name should have atleast 3 characters.');
      return;
    }
    if (!this.formData.email) {
      this.toastr.error('Email is a mandatory field.');
      return;
    }
    if (!this.commonService.validateEmail(this.formData.email)) {
      this.toastr.error(`Invalid e-mail address! Kindly recheck and re-enter the correct e-mail
      address.`);
      return;
    };
    if (!this.formData.mobile) {
      this.toastr.error('Mobile number is a mandatory field.');
      return;
    }
    if (!this.commonService.validateMobileNumber(this.formData.mobile)) {
      this.toastr.error(`Invalid mobile number! Kindly recheck and re-enter the correct mobile
      number.`);
      return;
    }

    if (this.formData.alternateMobile && !this.commonService.validateMobileNumber(this.formData.alternateMobile)) {
      this.toastr.error(`Invalid Alternate mobile number! Kindly recheck and re-enter the correct mobile
      number.`);
      return;
    }

    if (!this.formData.establishedOn) {
      this.toastr.error('Established date is a mandatory field.');
      return;
    }
    if (!this.formData.contactPerson) {
      this.toastr.error('Contact Person name is a mandatory field.');
      return;
    }
    if (!this.formData.contactPerson || this.formData.contactPerson.length < 3) {
      this.toastr.error('Contact Person Name should have atleast 3 characters.');
      return;
    }
    // if (!this.formData.address) {
    //   this.toastr.error('Address is a mandatory field.');
    //   return;
    // }
    // if (!this.formData.city) {
    //   this.toastr.error('City is a mandatory field.');
    //   return;
    // }
    // if (!this.formData.locality) {
    //   this.toastr.error('Locality is a mandatory field.');
    //   return;
    // }
    // if (!this.formData.pinCode) {
    //   this.toastr.error('PinCode is a mandatory field.');
    //   return;
    // }
    if (!this.formData.numberOfBranches) {
      this.toastr.error('Number of branches is a mandatory field.');
      return;
    }
    this.spinner.show();
    this.academyService.updateParetAcademy(this.formData).subscribe((data: any) => {
      if (data.data.status === "ERROR") {
        this.toastr.error(data.data.message);
        this.spinner.hide();
        return;
      }
      this.formData = {};
      this.checkIfSubmit = true;
      this.router.navigate(['/Sidemenu/parent-academy/parent-academy-list']);
      this.toastr.success('Parent academy updated successfully');
      this.spinner.hide();
    });
  }

  createParentAcademy() {
    // if (!this.formData.name && !this.formData.email && !this.formData.mobile && !this.formData.establishedOn && !this.formData.contactPerson
    //   && !this.formData.address && !this.formData.city && !this.formData.locality && !this.formData.pinCode && !this.formData.numberOfBranches) {
    //   this.toastr.error('All mandatory fields are required.');
    //   return;
    // }
    if (!this.formData.name) {
      this.toastr.error('Academy name is a mandatory field.');
      return;
    }
    if (!this.formData.name || this.formData.name.length < 3) {
      this.toastr.error('Academy name should have atleast 3 characters.');
      return;
    }
    if (!this.formData.email) {
      this.toastr.error('Email is a mandatory field.');
      return;
    }
    if (!this.commonService.validateEmail(this.formData.email)) {
      this.toastr.error(`Invalid e-mail address! Kindly recheck and re-enter the correct e-mail
      address.`);
      return;
    };
    if (!this.formData.mobile) {
      this.toastr.error('Mobile number is a mandatory field.');
      return;
    }
    if (!this.commonService.validateMobileNumber(this.formData.mobile)) {
      this.toastr.error(`Invalid mobile number! Kindly recheck and re-enter the correct mobile
      number.`);
      return;
    }

    if (this.formData.alternateMobile && !this.commonService.validateMobileNumber(this.formData.alternateMobile)) {
      this.toastr.error(`Invalid Alternate mobile number! Kindly recheck and re-enter the correct mobile
      number.`);
      return;
    }

    if (!this.formData.establishedOn) {
      this.toastr.error('Established date is a mandatory field.');
      return;
    }
    if (!this.formData.contactPerson) {
      this.toastr.error('Contact Person name is a mandatory field.');
      return;
    }
    if (!this.formData.contactPerson || this.formData.contactPerson.length < 3) {
      this.toastr.error('Contact Person Name should have atleast 3 characters.');
      return;
    }
    // if (!this.formData.address) {
    //   this.toastr.error('Address is a mandatory field.');
    //   return;
    // }
    // if (!this.formData.city) {
    //   this.toastr.error('City is a mandatory field.');
    //   return;
    // }
    // if (!this.formData.locality) {
    //   this.toastr.error('Locality is a mandatory field.');
    //   return;
    // }
    // if (!this.formData.pinCode) {
    //   this.toastr.error('PinCode is a mandatory field.');
    //   return;
    // }
    if (!this.formData.numberOfBranches) {
      this.toastr.error('Number of branches is a mandatory field.');
      return;
    }
    this.spinner.show();
    this.academyService.createParentAcademy(this.formData).subscribe((data: any) => {
      if (data.data.status === "ERROR") {
        this.toastr.error(data.data.message);
        this.spinner.hide();
        return;
      }
      this.formData = {};
      this.checkIfSubmit = true;
      this.router.navigate(['/Sidemenu/parent-academy/parent-academy-list']);
      this.toastr.success('Parent Academy created successfully.');
      this.spinner.hide();
    });
  }

  mapClicked($event: MouseEvent) {
    this.event = $event;
    this.lat = this.event.coords.lat;
    this.lng = this.event.coords.lng;
    // var latlng = this.event.coords;
    if (this.showCreateForm) {
      this.formData.location = {};
      this.formData.location.type = "Point";
      this.formData.location.coordinates = [this.event.coords.lat, this.event.coords.lng];
    } else {
      this.updateAcademyDetails.location.coordinates = [this.event.coords.lat, this.event.coords.lng];
    }
  }


  markerDragEnd($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng);
  }

  address: any;
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
          this.formData.address = results[0].formatted_address;
          if (results[0].address_components.length) {
            for (var componetIndex = 0; componetIndex < results[0].address_components.length; ++componetIndex) {
              if (results[0].address_components[componetIndex].types.length) {
                if (results[0].address_components[componetIndex].types.indexOf('postal_code') != -1) {
                  this.formData.pinCode = results[0].address_components[componetIndex].long_name;
                }
                if (results[0].address_components[componetIndex].types.indexOf('locality') != -1) {
                  this.formData.city = results[0].address_components[componetIndex].long_name;
                }
                if (results[0].address_components[componetIndex].types.indexOf('sublocality_level_1') != -1) {
                  this.formData.locality = results[0].address_components[componetIndex].long_name;
                }
              }
            }
          }
          this.ngZone.run(() => {
          });
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  clearMapDetails(type) {
    var academyData: any = {};
    var ngZone = this.ngZone;
    if (type == "CREATE") {
      this.formData.city = '';
      this.formData.locality = '';
      this.formData.pinCode = '';
      academyData = this.formData;
    }
    if (type == "UPDATE") {
      this.updateAcademyDetails.city = '';
      this.updateAcademyDetails.locality = '';
      this.updateAcademyDetails.pinCode = '';
      academyData = this.updateAcademyDetails;
    }
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({ 'location': { lat: this.lat, lng: this.lng } }, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          if (results[0].address_components.length) {
            for (var componetIndex = 0; componetIndex < results[0].address_components.length; ++componetIndex) {
              if (results[0].address_components[componetIndex].types.length) {
                if (results[0].address_components[componetIndex].types.indexOf('postal_code') != -1) {
                  academyData.pinCode = results[0].address_components[componetIndex].long_name;
                }
                if (results[0].address_components[componetIndex].types.indexOf('locality') != -1) {
                  academyData.city = results[0].address_components[componetIndex].long_name;
                }
                if (results[0].address_components[componetIndex].types.indexOf('sublocality_level_1') != -1) {
                  academyData.locality = results[0].address_components[componetIndex].long_name;
                }
              }
            }
          }

          academyData.address = results[0].formatted_address;
          ngZone.run(() => {

          });

        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  mobileNumberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (event.target.selectionStart === 0) {
      return (charCode === 54 || charCode === 55 || charCode === 56 || charCode === 57);
    }
    else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    
      return false;
    }
   
    return true;
  
  }

  alphabets_dot_space_only(e){
    return this.validationsService.alphabets_dot_space_only(e);
  }

  numberOnly(e){
    return this.validationsService.numberOnly(e);
  }
  alphabets_dot_space_number_only(e){
    return this.validationsService.alphabets_dot_space_number_only(e);
  }
  
}

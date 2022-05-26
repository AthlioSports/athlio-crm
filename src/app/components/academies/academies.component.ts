import {
  Component,
  OnInit,
  NgZone,
  ViewChild,
  ElementRef
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Routes, ActivatedRoute, RouterModule, Router } from "@angular/router";
import { MasterDataService } from "../../services/master_data/master-data.service";
import { AcademyService } from "../../services/academy/academy.service";
import {
  AppDateAdapter,
  APP_DATE_FORMATS
} from "./../../Utilities/date.datepicker";
import {
  NativeDateAdapter,
  DateAdapter,
  MAT_DATE_FORMATS,
  MatToolbarModule,
  MatTooltipModule
} from "@angular/material";
import { CookieService } from "angular2-cookie/core";
import { MapsAPILoader, MouseEvent } from "@agm/core";
import { FormControl } from "@angular/forms";
import { CommonService } from "./../../services/common.service";
import imageCompression from "browser-image-compression";
import { NgxSpinnerService } from "ngx-spinner";
import { ValidationsService } from "./../../services/validations/validations.service";
import {} from "googlemaps"; // to make this work need to edit this file node_modules\@types\googlemaps/index.d.ts   place declare module 'googlemaps';
import { FormCanDeactivate } from "../../form-can-deactivate/form-can-deactivate";
import { NgForm } from "@angular/forms";
declare var google: any;
declare var $: JQueryStatic;
// google api key
// AIzaSyAcdenESpDJVD3v4kPYTD9rSpZqFG2spIk

@Component({
  selector: "app-academies",
  templateUrl: "./academies.component.html",
  styleUrls: ["./academies.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: APP_DATE_FORMATS
    }
  ]
})
export class AcademiesComponent extends FormCanDeactivate implements OnInit {
  @ViewChild("aF") form: NgForm;

  @ViewChild("fileUpload")
  selectedFileElement: ElementRef;
  checkIfSubmit: boolean = false;
  constructor(
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private toastr: ToastrService,
    private router: Router,
    private masterDataService: MasterDataService,
    private academyService: AcademyService,
    private cookieService: CookieService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private validationsService: ValidationsService
  ) {
    super();
  }

  title: string = "My first AGM project";
  lat: number = 17.38714;
  lng: number = 78.491684;
  zoom: number = 12;
  event: any = {
    coords: {
      lat: 0,
      lng: 0
    }
  };

  formData: any = {
    amenities: [],
    timings: [],
    court_details: [],
    images: [],
    coordinates: {},
    mobile: ""
  };
  amenity: string;

  fileName: any = [];
  formImageData: FormData = new FormData();
  qImgLocalPath: any = [];
  years: string;
  showAmenityEdit = false;
  showTimeEdit = false;
  showCourtEdit = false;
  disableSubmit = false;
  disableUpdate = false;
  type = "CREATE";
  public searchControl: FormControl;

  currentAmenityIndex: number;
  currentTimeIndex: number;
  currentCourtIndex: number;

  masterSportsList: any;
  masterDaysList: any;
  masterCourtsList: any;

  sportsList: any;
  day: any = "";
  start_time: any = "";
  end_time: any = "";
  showCreateForm: boolean = true;

  sport: any = "";
  court: any = "";
  count: any;
  court_details: any = [];
  userDetails: any = {};
  updateAcademyDetails: any = {};
  updateSportsList: any = [];
  updateTimings: any = [];
  updateCourts: any = [];
  geoCoder: any;
  parentAcademyLogin: any;
  disableInputs: boolean = false;
  academyLogin: boolean = false;
  now = new Date();

  @ViewChild("search")
  public searchElementRef: ElementRef;
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.type === "EDIT") {
        this.disableInputs = false;
      } else {
        this.disableInputs = true;
      }
    });
    this.userDetails = this.cookieService.getObject("loginResponce");
    if (
      this.userDetails &&
      this.userDetails.type &&
      this.userDetails.type.toLowerCase() == "academyadmin"
    ) {
      this.academyLogin = true;
      this.formData.academy = this.userDetails.id;
    } else if (
      this.userDetails &&
      this.userDetails.type &&
      this.userDetails.type.toLowerCase() == "parentacademy"
    ) {
      this.parentAcademyLogin = true;
    }
    this.geoCoder = new google.maps.Geocoder();
    this.masterDataService.getSports().subscribe(
      (data: any) => {
        this.masterSportsList = data.data;
        this.masterSportsList.sort(function(a, b) {
          if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1;
          }
          if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1;
          }
          return 0;
        });
      },
      error => {}
    );
    this.getBatches();
    this.masterDataService.getDays().subscribe(
      (data: any) => {
        this.masterDaysList = data.data;
      },
      error => {}
    );
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ["address"]
        }
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 12;
          if (this.activatedRoute.snapshot.params.academyId) {
            this.updateAcademyDetails.coordinates = { lng: this.lng, lat: this.lat };
          }else{
            this.formData.coordinates = { lng: this.lng, lat: this.lat };
          }
        });
      });
    });
    if (this.activatedRoute.snapshot.params.academyId) {
      this.showCreateForm = false;
      this.type = "UPDATE";
      this.academyService
        .getAcademyDetails(this.activatedRoute.snapshot.params.academyId)
        .subscribe(
          (data: any) => {
            this.updateAcademyDetails = data.data;
            this.updateAcademyDetails.id = this.updateAcademyDetails._id;
            delete this.updateAcademyDetails._id;
            if (
              this.updateAcademyDetails.sport &&
              this.updateAcademyDetails.sport.length
            ) {
              this.updateSportsList = this.masterSportsList.filter(sport => {
                if (this.updateAcademyDetails.sport.indexOf(sport.name) != -1) {
                  return sport.id;
                }
              });
            }
            this.academyService
              .getAcademyCourts(this.updateAcademyDetails.id)
              .subscribe(
                (data: any) => {
                  this.updateCourts = data.data;
                },
                error => {
                  this.toastr.success("No timings found.");
                }
              );
          },
          error => {
            this.toastr.success("No data found.");
          }
        );
    } else {
      if (navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
          this.lng = +pos.coords.longitude;
          this.lat = +pos.coords.latitude;
          this.getAddress(this.lat, this.lng);
          this.formData.coordinates = { lng: this.lng, lat: this.lat };
        });
      }
      this.showCreateForm = true;
    }
    this.getParentAcademiesToMapWithBranch();
    this.getAmenities();
    this.onActivate(event);
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

  masterAmenities = [];
  getAmenities() {
    this.masterDataService.getAmenities().subscribe(
      (data: any) => {
        this.masterAmenities = data.data.data;
      },
      error => {}
    );
  }

  editData(id) {
    this.router.navigate(
      [
        "/Sidemenu/academies/addacademies/" +
          this.activatedRoute.snapshot.params.academyId
      ],
      { queryParams: { type: "EDIT" } }
    );
  }

  getAcademyTimings() {
    this.academyService
      .getAcademyTimings(this.updateAcademyDetails._id)
      .subscribe(
        (data: any) => {
          this.updateTimings = data.data;
        },
        error => {
          this.toastr.success("No timings found.");
        }
      );
  }
  parentAcademies = [];
  getParentAcademiesToMapWithBranch() {
    this.academyService.getParentAcademiesToMapWithBranch({}).subscribe(
      (data: any) => {
        this.parentAcademies = data.data.data;
        if (this.updateAcademyDetails.parentAcademy) {
          this.parentAcademies.push(
            ...this.updateAcademyDetails.parentAcademyData
          );
        }
      },
      error => {}
    );
  }
  clearMapDetails(type) {
    var academyData: any = {};
    var ngZone = this.ngZone;
    if (type == "CREATE") {
      this.formData.city = "";
      this.formData.locality = "";
      this.formData.pincode = "";
      academyData = this.formData;
    }
    if (type == "UPDATE") {
      this.updateAcademyDetails.city = "";
      this.updateAcademyDetails.locality = "";
      this.updateAcademyDetails.pincode = "";
      academyData = this.updateAcademyDetails;
    }
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat: this.lat, lng: this.lng } }, function(
      results,
      status
    ) {
      if (status === "OK") {
        if (results[0]) {
          if (results[0].address_components.length) {
            for (
              var componetIndex = 0;
              componetIndex < results[0].address_components.length;
              ++componetIndex
            ) {
              if (results[0].address_components[componetIndex].types.length) {
                if (
                  results[0].address_components[componetIndex].types.indexOf(
                    "postal_code"
                  ) != -1
                ) {
                  academyData.pincode =
                    results[0].address_components[componetIndex].long_name;
                }
                if (
                  results[0].address_components[componetIndex].types.indexOf(
                    "locality"
                  ) != -1
                ) {
                  academyData.city =
                    results[0].address_components[componetIndex].long_name;
                }
                if (
                  results[0].address_components[componetIndex].types.indexOf(
                    "sublocality_level_1"
                  ) != -1
                ) {
                  academyData.locality =
                    results[0].address_components[componetIndex].long_name;
                }
              }
            }
          }

          academyData.address = results[0].formatted_address;
          ngZone.run(() => {});

          /*map.setZoom(11);
          var marker = new google.maps.Marker({
            position: latlng,
            map: map
          });
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(map, marker);*/
        } else {
          window.alert("No results found");
        }
      } else {
        window.alert("Geocoder failed due to: " + status);
      }
    });
  }
  mapClicked($event: MouseEvent) {
    this.event = $event;
    this.lat = this.event.coords.lat;
    this.lng = this.event.coords.lng;
    // var latlng = this.event.coords;
    if (this.showCreateForm) {
      this.formData.coordinates = this.event.coords;
    } else {
      this.updateAcademyDetails.coordinates = this.event.coords;
    }
  }
  subscriptionYearsChange(data) {
    if (this.formData.subscription_start) {
      var d = new Date(this.formData.subscription_start);
      var year = d.getFullYear() + parseInt(data);
      var month = d.getMonth();
      var day = d.getDate();
      this.formData.subscription_end = new Date(year, month, day);
    }
  }
  subscriptionStartChange(data) {
    if (this.formData.years) {
      var d = new Date(data);
      var year = d.getFullYear() + parseInt(this.formData.years);
      var month = d.getMonth();
      var day = d.getDate();
      this.formData.subscription_end = new Date(year, month, day);
    }
  }
  subscriptionYearsUpdateChange(data) {
    if (this.updateAcademyDetails.subscription_start) {
      var d = new Date(this.updateAcademyDetails.subscription_start);
      var year = d.getFullYear() + parseInt(data);
      var month = d.getMonth();
      var day = d.getDate();
      this.updateAcademyDetails.subscription_end = new Date(year, month, day);
    }
  }
  subscriptionStartUpdateChange(data) {
    if (this.updateAcademyDetails.years) {
      var d = new Date(data);
      var year = d.getFullYear() + parseInt(this.updateAcademyDetails.years);
      var month = d.getMonth();
      var day = d.getDate();
      this.updateAcademyDetails.subscription_end = new Date(year, month, day);
    }
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  addAmenity() {
    if (!this.amenity || !/\S/.test(this.amenity)) {
      this.toastr.error("Amenity should not be empty");
    } else {
      let amenityFound = this.formData.amenities.filter(amenity => {
        return amenity == this.amenity;
      });
      if (amenityFound.length) {
        this.toastr.error("Amenity already added");
      } else {
        this.formData.amenities.push(this.amenity);
        this.amenity = "";
      }
    }
  }
  markerDragEnd($event: any) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    this.getAddress(this.lat, this.lng);
  }
  address: any;
  getAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            this.zoom = 12;
            this.address = results[0].formatted_address;
            this.formData.address = results[0].formatted_address;
            if (results[0].address_components.length) {
              for (
                var componetIndex = 0;
                componetIndex < results[0].address_components.length;
                ++componetIndex
              ) {
                if (results[0].address_components[componetIndex].types.length) {
                  if (
                    results[0].address_components[componetIndex].types.indexOf(
                      "postal_code"
                    ) != -1
                  ) {
                    this.formData.pincode =
                      results[0].address_components[componetIndex].long_name;
                  }
                  if (
                    results[0].address_components[componetIndex].types.indexOf(
                      "locality"
                    ) != -1
                  ) {
                    this.formData.city =
                      results[0].address_components[componetIndex].long_name;
                  }
                  if (
                    results[0].address_components[componetIndex].types.indexOf(
                      "sublocality_level_1"
                    ) != -1
                  ) {
                    this.formData.locality =
                      results[0].address_components[componetIndex].long_name;
                  }
                }
              }
            }
            this.ngZone.run(() => {});
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      }
    );
  }
  addUpdateAmenity() {
    if (!this.amenity || !/\S/.test(this.amenity)) {
      this.toastr.error("Amenity should not be empty");
    } else {
      let amenityFound = this.updateAcademyDetails.amenities.filter(amenity => {
        return amenity == this.amenity;
      });
      if (amenityFound.length) {
        this.toastr.error("Amenity already added");
      } else {
        this.updateAcademyDetails.amenities.push(this.amenity);
        this.amenity = "";
      }
    }
  }
  editUpdateAmenity(index) {
    this.showAmenityEdit = true;
    this.currentAmenityIndex = index;
    this.amenity = this.updateAcademyDetails.amenities[index];
  }
  editAmenity(index) {
    this.showAmenityEdit = true;
    this.currentAmenityIndex = index;
    this.amenity = this.formData.amenities[index];
  }
  updateAmenity() {
    if (!this.amenity || !/\S/.test(this.amenity)) {
      this.toastr.error("Amenity should not be empty");
      return;
    } else {
      this.showAmenityEdit = false;
      this.formData.amenities[this.currentAmenityIndex] = this.amenity;
      this.amenity = "";
    }
  }
  updateEditAmenity() {
    if (!this.amenity || !/\S/.test(this.amenity)) {
      this.toastr.error("Amenity should not be empty");
    } else {
      this.showAmenityEdit = false;
      this.updateAcademyDetails.amenities[
        this.currentAmenityIndex
      ] = this.amenity;
      this.amenity = "";
    }
  }
  removeAmenity(index) {
    this.formData.amenities.splice(index, 1);
  }
  currentAminityIndex: any;
  removeUpdateAmenity(index) {
    this.updateAcademyDetails.amenities.splice(index, 1);
  }
  resetTime() {
    this.day = "";
    this.start_time = "";
    this.end_time = "";
  }
  addTime() {
    if (!this.day || !this.start_time || !this.end_time) {
      this.toastr.error("Day or Start or End times should not be empty");
    } else {
      this.start_time = tConvert(this.start_time);
      this.end_time = tConvert(this.end_time);
      this.day.map(day => {
        let dayFound = this.formData.timings.filter(time => {
          return time.day == day;
        });
        if (!dayFound.length) {
          this.formData.timings.push({
            day: day,
            start_time: this.start_time,
            end_time: this.end_time
          });
        }
      });
      /*this.formData.timings.push({day : this.day,start_time : this.start_time,end_time:this.end_time
	  	});*/
      this.resetTime();
    }
  }
  updateTime() {
    if (!this.day || !this.start_time || !this.end_time) {
      this.toastr.error("Day or Start or End times should not be empty");
    } else {
      this.showTimeEdit = false;
      this.formData.timings[this.currentTimeIndex] = {
        day: this.day,
        start_time: this.start_time,
        end_time: this.end_time
      };
      this.resetTime();
    }
  }
  editTime(index) {
    this.showTimeEdit = true;
    this.currentTimeIndex = index;
    this.day = this.formData.timings[index].day;
    this.start_time = this.formData.timings[index].start_time;
    this.end_time = this.formData.timings[index].end_time;
  }
  removeTime(index) {
    this.formData.timings.splice(index, 1);
  }
  resetCourt() {
    this.sport = "";
    this.court = "";
    this.count = "";
  }
  sportSelected(data) {
    if (data && data.id) {
      this.masterDataService.getCourts(data.id).subscribe(
        (data: any) => {
          this.masterCourtsList = data.data;
          if (this.masterCourtsList.length == 0) {
            this.toastr.error("No courts for this sport found");
          }
        },
        error => {}
      );
    }
  }
  addCourt() {
    if (!this.sport || !this.court || !this.count) {
      this.toastr.error("Add sport, court and count");
    } else {
      let findCourt = this.court_details.filter(court => {
        return (
          court.sport.id.toString() == this.sport.id.toString() &&
          court.court.id.toString() == this.court.id.toString()
        );
      });
      if (findCourt.length) {
        let index = this.court_details.indexOf(findCourt[0]);
        this.court_details[index].count =
          parseInt(this.court_details[index].count) + parseInt(this.count);
      } else {
        this.court_details.push({
          sport: this.sport,
          court: this.court,
          count: this.count
        });
      }
      this.resetCourt();
    }
  }
  editCourt(index) {
    this.showCourtEdit = true;
    var data = { id: this.court_details[index].sport.id };
    //this.sportSelected(data);
    this.currentCourtIndex = index;
    this.sport = this.court_details[index].sport;
    this.court = this.court_details[index].court;
    this.count = this.court_details[index].count;
  }
  updateCourt() {
    if (!this.sport || !this.court || !this.count) {
      this.toastr.error("Add sport, court and count");
    } else {
      this.showCourtEdit = false;
      this.court_details[this.currentCourtIndex] = {
        sport: this.sport,
        court: this.court,
        count: this.count
      };
      this.resetCourt();
    }
  }
  removeCourt(index) {
    this.court_details.splice(index, 1);
  }

  // uploadProfilePic(event: any) {

  //   if (event.target.files) {
  //     for (var fileIndex = 0; fileIndex < event.target.files.length; ++fileIndex) {
  //       var addedFiled = this.formImageData.getAll('academyImages');
  //       var findFile = this.fileName.filter((fileData) => {
  //         return fileData == event.target.files[fileIndex].name;
  //       });
  //       if (!findFile.length) {
  //         this.fileName.push(event.target.files[fileIndex].name);
  //         this.formImageData.append('academyImages', event.target.files[fileIndex]);
  //       }
  //       let reader = new FileReader();
  //       reader.onload = (event: ProgressEvent) => {
  //         var findImage = this.qImgLocalPath.filter((image) => {
  //           return image == (<FileReader>event.target).result;
  //         });
  //         if (!findImage.length) {
  //           this.qImgLocalPath.push((<FileReader>event.target).result);
  //         }
  //       };
  //       reader.readAsDataURL(event.target.files[fileIndex]);
  //     }
  //     this.selectedFileElement.nativeElement.value = "";
  //   } else {
  //     this.fileName = [];
  //     this.formImageData = new FormData();
  //     let reader = new FileReader();
  //   }
  // }

  async uploadProfilePic(event: any) {
    this.spinner.show();
    if (event.target.files) {
      for (
        var fileIndex = 0;
        fileIndex < event.target.files.length;
        ++fileIndex
      ) {
        var options = { maxSizeMB: 0.5, maxWidthOrHeight: 1024 };
        const result = await imageCompression(
          event.target.files[fileIndex],
          options
        ); //new File([await imageCompression(event.target.files[fileIndex], options)], event.target.files[fileIndex].name);
        var addedFiled = this.formImageData.getAll("academyImages");
        var findFile = this.fileName.filter(fileData => {
          return fileData == event.target.files[fileIndex].name;
        });
        if (!findFile.length) {
          this.fileName.push(result.name);
          this.formImageData.append(
            "academyImages",
            result,
            event.target.files[fileIndex].name
          );
        }
        let reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onload = (event: ProgressEvent) => {
          var findImage = this.qImgLocalPath.filter(image => {
            return image == (<FileReader>event.target).result;
          });
          if (!findImage.length) {
            this.qImgLocalPath.push((<FileReader>event.target).result);
          }
        };
      }
      this.selectedFileElement.nativeElement.value = "";
      this.spinner.hide();
    } else {
      this.fileName = [];
      this.formImageData = new FormData();
      let reader = new FileReader();
      this.spinner.hide();
    }
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  };
  removeImage(index) {
    let images = this.formImageData.getAll("academyImages");
    this.qImgLocalPath.splice(this.currentImageIndex, 1);
    this.fileName.splice(this.currentImageIndex, 1);
    images.splice(index, 1);
    this.formImageData.delete("academyImages");
    images.map(image => {
      this.formImageData.append("academyImages", image);
    });
  }
  removeUpdateImage() {
    this.updateAcademyDetails.images.splice(this.currentImageIndex, 1);
    this.updateAcademyDetails.imageNames.splice(this.currentImageIndex, 1);
  }
  getCurrentImageIndex(index) {
    this.currentImageIndex = index;
  }
  currentImageIndex: any;
  cancelRemoveUpdateImage() {
    this.currentImageIndex = "";
  }
  addAcademy() {
    this.disableSubmit = true;
    if (this.formData.display_name && this.formData.display_name.length < 2) {
      this.toastr.error("Display name should have atleast 2 characters.");
      this.disableSubmit = false;
      return;
    }
    if (!this.formData.name || !/\S/.test(this.formData.name)) {
      this.toastr.error("Academy name is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (this.formData.name.length < 3) {
      this.toastr.error("Academy name should have atleast 3 characters.");
      this.disableSubmit = false;
      return;
    }
    if (!this.formData.email || !/\S/.test(this.formData.email)) {
      this.toastr.error("Email is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (!this.commonService.validateEmail(this.formData.email)) {
      this.toastr.error(`Invalid e-mail address! Kindly recheck and re-enter the correct e-mail
      address.`);
      this.disableSubmit = false;
      return;
    }
    if (!this.formData.mobile || !/\S/.test(this.formData.mobile)) {
      this.toastr.error("Mobile number is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (!this.commonService.validateMobileNumber(this.formData.mobile)) {
      this.toastr.error(`Invalid mobile number! Kindly recheck and re-enter the correct mobile
      number.`);
      this.disableSubmit = false;
      return;
    }

    if (
      this.formData.alternate_number &&
      !this.commonService.validateMobileNumber(this.formData.alternate_number)
    ) {
      this.toastr.error("Please enter valid alternate mobile number");
      this.disableSubmit = false;
      return;
    }

    if (
      !this.formData.established_on ||
      !/\S/.test(this.formData.established_on)
    ) {
      this.toastr.error("Established date is a mandatory field.");
      this.disableSubmit = false;
      return;
    }

    if (
      !this.formData.contact_person ||
      !/\S/.test(this.formData.contact_person)
    ) {
      this.toastr.error("Contact person is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (this.formData.contact_person.length < 3) {
      this.toastr.error(
        "Contact person name should have atleast 3 characters."
      );
      this.disableSubmit = false;
      return;
    }
    if (!this.formData.address || !/\S/.test(this.formData.address)) {
      this.toastr.error("Address is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (!this.formData.city || !/\S/.test(this.formData.city)) {
      this.toastr.error("City is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (!this.formData.locality || !/\S/.test(this.formData.locality)) {
      this.toastr.error("Locality is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (!this.formData.pincode || !/\S/.test(this.formData.pincode)) {
      this.toastr.error("Pincode is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (!this.formData.contactEmail || !/\S/.test(this.formData.contactEmail)) {
      this.toastr.error("Contact email is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (
      !this.formData.contactNumber ||
      !/\S/.test(this.formData.contactNumber)
    ) {
      this.toastr.error("Contact number is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (!this.commonService.validateMobileNumber(this.formData.contactNumber)) {
      this.toastr.error(`Invalid Contact mobile number! Kindly recheck and re-enter the correct mobile
      number.`);
      this.disableSubmit = false;
      return;
    }
    if (!this.sportsList || this.sportsList.length === 0) {
      this.toastr.error("Sport is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (!this.formData.batchList || this.formData.batchList.length === 0) {
      this.toastr.error("Batch is a mandatory field.");
      this.disableSubmit = false;
      return;
    }

    if (!this.formData.coordinates) {
      this.toastr.error("Academy Coordinates are required");
      this.disableSubmit = false;
      return;
    }
    this.userDetails = this.cookieService.getObject("loginResponce");
    this.formData.created_by = this.userDetails.id;
    if (this.sportsList && this.sportsList.length) {
      this.formData.sports = [];
      this.formData.sports = this.sportsList.map(sport => sport.id);
      this.formData.sport = this.sportsList.map(sport => sport.name);
    }
    if (this.court_details && this.court_details.length) {
      this.formData.court_details = [];
      this.formData.court_details = this.court_details.map(courtData => {
        let rObj = {};
        rObj["sport"] = courtData.sport.id;
        rObj["court_type"] = courtData.court.id;
        rObj["count"] = courtData.count;
        return rObj;
      });
    }
    if (this.formImageData.getAll("academyImages").length) {
      this.masterDataService
        .uploadPic(this.formImageData)
        .subscribe((data: any) => {
          this.disableSubmit = false;
          this.formData.images = [];
          this.formData.imageNames = [];
          data.data.result.files.academyImages.map(imageData => {
            this.formData.images.push(imageData.providerResponse.location);
            this.formData.imageNames.push(imageData.originalFilename);
          });
          // this.formData.imageNames = this.fileName;
          // this.formData.imageNames.reverse();
          this.academyService.createAcademy(this.formData).subscribe(
            (data: any) => {
              // this.masterSportsList = data.data;
              this.toastr.success("Academy created successfully.");
              this.checkIfSubmit = true;
              this.router.navigate(["/Sidemenu/academies/academiesList"]);
            },
            error => {
              this.disableSubmit = false;
              this.toastr.error(error.error.error.message);
            }
          );
        });
    } else {
      this.toastr.error(`Looks like you haven’t uploaded an image yet! It is time to upload an image
      and complete this profile!`);
      this.disableSubmit = false;
      // this.academyService.createAcademy(this.formData).subscribe((data: any) => {
      //   this.disableSubmit = false;
      //   this.toastr.success('Academy created successfully.');
      //   this.router.navigate(['/Sidemenu/academies/academiesList']);
      // }, error => {
      //   this.disableSubmit = false;
      //   this.toastr.error(error.error.error.message);
      // });
    }
  }
  batchesList: any = [];
  getBatches() {
    this.masterDataService.getAllBatches().subscribe(
      (data: any) => {
        this.batchesList = data.data;
        this.batchesList.sort(function(a, b) {
          if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1;
          }
          if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1;
          }
          return 0;
        });
      },
      error => {}
    );
  }
  updateAcademy() {
    if (
      this.updateAcademyDetails.display_name &&
      this.updateAcademyDetails.display_name.length < 2
    ) {
      this.toastr.error("Display name should have atleast 2 characters.");
      this.disableSubmit = false;
      return;
    }
    if (
      !this.updateAcademyDetails.name ||
      !/\S/.test(this.updateAcademyDetails.name)
    ) {
      this.toastr.error("Academy name is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (this.updateAcademyDetails.name.length < 3) {
      this.toastr.error("Academy name should have atleast 3 characters.");
      this.disableSubmit = false;
      return;
    }
    if (
      !this.updateAcademyDetails.established_on ||
      !/\S/.test(this.updateAcademyDetails.established_on)
    ) {
      this.toastr.error("Established date  is a mandatory field.");
      this.disableSubmit = false;
      return;
    }

    if (
      !this.updateAcademyDetails.address ||
      !/\S/.test(this.updateAcademyDetails.address)
    ) {
      this.toastr.error("Address is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (
      !this.updateAcademyDetails.city ||
      !/\S/.test(this.updateAcademyDetails.city)
    ) {
      this.toastr.error("City is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (
      !this.updateAcademyDetails.locality ||
      !/\S/.test(this.updateAcademyDetails.locality)
    ) {
      this.toastr.error("Locality is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (
      !this.updateAcademyDetails.pincode ||
      !/\S/.test(this.updateAcademyDetails.pincode)
    ) {
      this.toastr.error("Pincode is a mandatory field.");
      this.disableSubmit = false;
      return;
    }

    if (
      !this.updateAcademyDetails.contact_person ||
      !/\S/.test(this.updateAcademyDetails.contact_person)
    ) {
      this.toastr.error("Contact person is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (this.updateAcademyDetails.contact_person.length < 3) {
      this.toastr.error(
        "Contact person name should have atleast 3 characters."
      );
      this.disableSubmit = false;
      return;
    }
    if (
      !this.updateAcademyDetails.contactEmail ||
      !/\S/.test(this.updateAcademyDetails.contactEmail)
    ) {
      this.toastr.error("Contact email is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (
      !this.updateAcademyDetails.contactNumber ||
      !/\S/.test(this.updateAcademyDetails.contactNumber)
    ) {
      this.toastr.error("Contact number is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (
      !this.commonService.validateMobileNumber(
        this.updateAcademyDetails.contactNumber
      )
    ) {
      this.toastr.error(`Invalid Contact mobile number! Kindly recheck and re-enter the correct mobile
      number.`);
      this.disableSubmit = false;
      return;
    }

    if (
      this.updateAcademyDetails.alternate_number &&
      !this.commonService.validateMobileNumber(
        this.updateAcademyDetails.alternate_number
      )
    ) {
      this.toastr.error(`Invalid Alternate mobile number! Kindly recheck and re-enter the correct mobile
      number.`);
      this.disableSubmit = false;
      return;
    }
    if (this.updateAcademyDetails.batchList.length === 0) {
      this.toastr.error("Batch is a mandatory field.");
      this.disableSubmit = false;
      return;
    }
    if (!this.updateAcademyDetails.coordinates) {
      this.toastr.error("Academy Coordinates are required");
      this.disableSubmit = false;
      return;
    }
    // if ((<HTMLInputElement>document.getElementById("updateAddress")) && (<HTMLInputElement>document.getElementById("updateAddress")).value) {
    //   this.updateAcademyDetails.address = (<HTMLInputElement>document.getElementById("updateAddress")).value;
    // }
    // if ((<HTMLInputElement>document.getElementById("updatePincode")) && (<HTMLInputElement>document.getElementById("updatePincode")).value) {
    //   this.updateAcademyDetails.pincode = (<HTMLInputElement>document.getElementById("updatePincode")).value;
    // }
    // if ((<HTMLInputElement>document.getElementById("updateCity")) && (<HTMLInputElement>document.getElementById("updateCity")).value) {
    //   this.updateAcademyDetails.city = (<HTMLInputElement>document.getElementById("updateCity")).value;
    // }
    // if ((<HTMLInputElement>document.getElementById("updateLocality")) && (<HTMLInputElement>document.getElementById("updateLocality")).value) {
    //   this.updateAcademyDetails.locality = (<HTMLInputElement>document.getElementById("updateLocality")).value;
    // }

    if (this.updateSportsList && this.updateSportsList.length) {
      this.updateAcademyDetails.sports = [];
      this.updateAcademyDetails.sports = this.updateSportsList.map(
        sport => sport.id
      );
      this.updateAcademyDetails.sport = this.updateSportsList.map(
        sport => sport.name
      );
    }

    if (this.court_details && this.court_details.length) {
      this.formData.court_details = [];
      this.formData.court_details = this.court_details.map(courtData => {
        let rObj = {};
        rObj["sport"] = courtData.sport.id;
        rObj["court_type"] = courtData.court.id;
        rObj["count"] = courtData.count;
        return rObj;
      });
    }
    if (
      this.formImageData.getAll("academyImages").length ||
      this.updateAcademyDetails.images.length > 0
    ) {
      if (this.formImageData.getAll("academyImages").length) {
        this.masterDataService
          .uploadPic(this.formImageData)
          .subscribe((data: any) => {
            this.disableUpdate = false;
            // this.formData.images = [];
            data.data.result.files.academyImages.map(imageData => {
              this.updateAcademyDetails.images.push(
                imageData.providerResponse.location
              );
              this.updateAcademyDetails.imageNames.push(
                imageData.originalFilename
              );
            });
            // this.updateAcademyDetails.imageNames = this.fileName;
            // this.updateAcademyDetails.imageNames.reverse();
            // this.updateAcademyDetails.id = this.updateAcademyDetails._id;
            //delete this.updateAcademyDetails._id;
            this.academyService
              .updateDetails(this.updateAcademyDetails)
              .subscribe(
                (data: any) => {
                  // this.masterSportsList = data.data;
                  this.checkIfSubmit = true;
                  this.toastr.success("Academy updated successfully.");
                  this.router.navigate(["/Sidemenu/academies/academiesList"]);
                },
                error => {
                  this.disableUpdate = false;
                  this.toastr.error(error.error.error.message);
                }
              );
          });
      } else {
        // this.updateAcademyDetails.id = this.updateAcademyDetails._id;
        //delete this.updateAcademyDetails._id;
        this.academyService.updateDetails(this.updateAcademyDetails).subscribe(
          (data: any) => {
            // this.masterSportsList = data.data;
            this.checkIfSubmit = true;
            this.toastr.success("Academy updated successfully.");
            this.router.navigate(["/Sidemenu/academies/academiesList"]);
          },
          error => {
            this.disableUpdate = false;
            this.toastr.error(error.error.error.message);
          }
        );
      }
    } else {
      this.toastr.error(`Looks like you haven’t uploaded an image yet! It is time to upload an image
      and complete this profile!`);
      this.disableSubmit = false;

      // this.updateAcademyDetails.id = this.updateAcademyDetails._id;
      // this.academyService.updateDetails(this.updateAcademyDetails).subscribe((data: any) => {
      //   this.disableUpdate = false;
      //   this.toastr.success('Academy updated successfully.');
      //   this.router.navigate(['/Sidemenu/academies/academiesList']);
      // }, error => {
      //   this.disableUpdate = false;
      //   this.toastr.error(error.error.error.message);
      // });
    }
  }
  ClearSubscriptionDates() {
    if (this.showCreateForm) {
      this.formData.subscription_start = "";
      this.formData.subscription_end = "";
    } else {
      this.updateAcademyDetails.subscription_start = "";
      this.updateAcademyDetails.subscription_end = "";
    }
  }
  isContactDetailsSame = false;
  getOrRemoveContactDetails() {
    if (this.showCreateForm) {
      if (this.formData.isContactDetailsSame) {
        this.formData.contactEmail = this.formData.email;
        this.formData.contactNumber = this.formData.mobile;
      } else {
        this.formData.contactEmail = "";
        this.formData.contactNumber = "";
      }
    } else {
      if (this.updateAcademyDetails.isContactDetailsSame) {
        this.updateAcademyDetails.contactEmail = this.updateAcademyDetails.email;
        this.updateAcademyDetails.contactNumber = this.updateAcademyDetails.mobile;
      } else {
        this.updateAcademyDetails.contactEmail = "";
        this.updateAcademyDetails.contactNumber = "";
      }
    }
  }
  mobileNumberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (event.target.selectionStart === 0) {
      return (
        charCode === 54 || charCode === 55 || charCode === 56 || charCode === 57
      );
    } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }

  checkForDuplicateAcademiesWithEmAilOrMobile(type, condition) {
    this.spinner.show();
    let data;
    if (type === "MOBILE") {
      data = {
        type: type,
        mobile: condition
      };
    } else if (type === "EMAIL") {
      data = {
        type: type,
        email: condition
      };
    }
    this.academyService
      .checkForDuplicateAcademiesWithEmAilOrMobile(data)
      .subscribe(
        (data: any) => {
          if (data.data.status == 200) {
            if (data.data.data.length > 0) {
              if (type === "MOBILE") {
                this.toastr.error(
                  "Academy already existed with this Mobile Number."
                );
              } else if (type === "EMAIL") {
                this.toastr.error("Academy already existed with this Email.");
              }
            }
            this.spinner.hide();
          }
        },
        error => {
          this.toastr.error(error.error.error.message);
          this.spinner.hide();
        }
      );
  }

  alphabets_dot_space_only(e) {
    return this.validationsService.alphabets_dot_space_only(e);
  }

  alphabets_dot_space_number_only(e) {
    return this.validationsService.alphabets_dot_space_number_only(e);
  }
}

function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
}

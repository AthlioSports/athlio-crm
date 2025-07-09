import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppSettings } from "../../apiUrls";

import { map, filter, catchError, mergeMap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AcademyService {
  constructor(private httpClient: HttpClient) {}
  activeLink: boolean = false;
  createAcademy(academyDetails) {
    return this.httpClient
      .post(AppSettings.API_ENDPOINT + "academies", academyDetails)
      .pipe(map((res: any) => res));
  }
  updateDetails(updateObj) {
    return this.httpClient
      .post(AppSettings.API_ENDPOINT + "academies/updateDetails", updateObj)
      .pipe(map((res: any) => res));
  }

  checkForDuplicateAcademiesWithEmAilOrMobile(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT +
          "academies/checkForDuplicateAcademiesWithEmAilOrMobile",
        data
      )
      .pipe(map((res: any) => res));
  }

  getAllCitiesOfAcademies(data) {
    return this.httpClient
      .post(AppSettings.API_ENDPOINT + "academies/getCitiesOfAcademies", data)
      .pipe(map((res: any) => res));
  }

  getAllSports() {
    return this.httpClient
      .get(AppSettings.API_ENDPOINT + "sports")
      .pipe(map((res: any) => res));
  }

  getSportsListByAcademyOrParentAcademyOrAll(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT +
          "academies/getSportsListByAcademyOrParentAcademyOrAll",
        data
      )
      .pipe(map((res: any) => res));
  }

  getAllAmenities() {
    return this.httpClient
      .get(AppSettings.API_ENDPOINT + "aminities")
      .pipe(map((res: any) => res));
  }

  getAmenitiesListByAcademyOrParentAcademyOrAll(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT +
          "academies/getAmenitiesListByAcademyOrParentAcademyOrAll",
        data
      )
      .pipe(map((res: any) => res));
  }

  approveVideo(updateObj) {
    return this.httpClient
      .post(AppSettings.API_ENDPOINT + "videos/approvePendingVideos", updateObj)
      .pipe(map((res: any) => res));
  }
  rejectVideo(updateObj) {
    return this.httpClient
      .post(AppSettings.API_ENDPOINT + "videos/rejectPendingVideos", updateObj)
      .pipe(map((res: any) => res));
  }
  deleteVideo(updateObj) {
    return this.httpClient
      .post(AppSettings.API_ENDPOINT + "videos/deleteVideo", updateObj)
      .pipe(map((res: any) => res));
  }
  deleteAcademy(id) {
    return this.httpClient
      .put(AppSettings.API_ENDPOINT + "academies/deleteAcademy?id=" + id, {})
      .pipe(map((res: any) => res));
  }
  getAcademiesList() {
    return this.httpClient
      .get(AppSettings.API_ENDPOINT + "academies/getList")
      .pipe(map((res: any) => res));
  }
  getActiveAcademiesList() {
    return this.httpClient
      .get(AppSettings.API_ENDPOINT + "academies/getActiveAcademiesList")
      .pipe(map((res: any) => res));
  }
  getAcademiesListByAcademyOrParentAcademyOrAll(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT +
          "academies/getAcademiesListByAcademyOrParentAcademyOrAll",
        data
      )
      .pipe(map((res: any) => res));
  }
  getAllCertifications(data) {
    return this.httpClient
      .post(AppSettings.API_ENDPOINT + "coaches/getCertifications", data)
      .pipe(map((res: any) => res));
  }
  getAcademyTimings(id) {
    return this.httpClient
      .get(
        AppSettings.API_ENDPOINT + "academy_timings/getAcademyTimings?id=" + id
      )
      .pipe(map((res: any) => res));
  }
  getAcademyCourts(id) {
    return this.httpClient
      .get(
        AppSettings.API_ENDPOINT + "academy_courts/getAcademyCourts?id=" + id
      )
      .pipe(map((res: any) => res));
  }
  getAcademySports(id) {
    return this.httpClient
      .get(AppSettings.API_ENDPOINT + "academies/getAcademySportsList?id=" + id)
      .pipe(map((res: any) => res));
  }

  getBatchesListByAcademyOrParentAcademyOrAll(data) {
    return this.httpClient
      .post(AppSettings.API_ENDPOINT + "academies/getBatchesListByAcademyOrParentAcademyOrAll", data)
      .pipe(map((res: any) => res));
  }

  getBathes(coachId) {
    return this.httpClient
      .get(AppSettings.API_ENDPOINT + "coaches/getBatches?id=" + coachId)
      .pipe(map((res: any) => res));
  }

  getAcademyDetails(id) {
    return this.httpClient
      .get(AppSettings.API_ENDPOINT + "academies/getList?id=" + id)
      .pipe(map((res: any) => res));
  }
  getParentAcademyDetails(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT + "parent_academies/getParentAcademyDetails",
        data
      )
      .pipe(map((res: any) => res));
  }
  deleteParentAcademy(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT + "parent_academies/deleteParentAcademy",
        data
      )
      .pipe(map((res: any) => res));
  }
  getAcademySportTimings(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT + "sport_timings/getIndividualBatchTimings",
        data
      )
      .pipe(map((res: any) => res));
  }
  getParentAcademiesToMapWithBranch(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT +
          "parent_academies/getParentAcademiesToMapWithBranch",
        data
      )
      .pipe(map((res: any) => res));
  }
  createAcademyStudentBatch(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT + "academies/createAcademyStudentBatches",
        data
      )
      .pipe(map((res: any) => res));
  }
  createAcademyStudentBatchTimings(data) {
    return this.httpClient
      .post(AppSettings.API_ENDPOINT + "batchTimings/createTimings", data)
      .pipe(map((res: any) => res));
  }
  getStudentsToAddDiscounts(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT + "students/getStudentsToMapDiscounts",
        data
      )
      .pipe(map((res: any) => res));
  }
  createDiscounts(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT + "students_discounts/createDiscounts",
        data
      )
      .pipe(map((res: any) => res));
  }
  getBatchTimingsByBatchFeeId(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT + "batchTimings/getBatchTimingsByBatchFeeId",
        data
      )
      .pipe(map((res: any) => res));
  }
  deleteBatchTimingsById(id) {
    return this.httpClient
      .delete(AppSettings.API_ENDPOINT + `batchTimings/${id}`)
      .pipe(map((res: any) => res));
  }
  editDiscount(data) {
    return this.httpClient
      .post(AppSettings.API_ENDPOINT + "students_discounts/editDiscounts", data)
      .pipe(map((res: any) => res));
  }
  deleteDiscount(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT + "students_discounts/deleteDiscounts",
        data
      )
      .pipe(map((res: any) => res));
  }
  updateAcademyStudentBatch(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT + "academies/updateAcademyStudentBatch",
        data
      )
      .pipe(map((res: any) => res));
  }
  updateAcademyProfilePic(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT + "academies/updateAcademyProfilePic",
        data
      )
      .pipe(map((res: any) => res));
  }
  getgAcademyProfilePic(data) {
    return this.httpClient
      .post(AppSettings.API_ENDPOINT + "academies/getgAcademyProfilePic", data)
      .pipe(map((res: any) => res));
  }
  deleteAcademyStudentBatch(data) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT + "academies/deleteAcademyStudentBatches",
        data
      )
      .pipe(map((res: any) => res));
  }
  getAcademyStudentBatches(data) {
    return this.httpClient
      .post(AppSettings.API_ENDPOINT + "academies/getSportTimes", data)
      .pipe(map((res: any) => res));
  }
  getSports() {
    return this.httpClient
      .get(AppSettings.API_ENDPOINT + "sports")
      .pipe(map((res: any) => res));
  }
  getBatches() {
    return this.httpClient
      .get(AppSettings.API_ENDPOINT + "student_batches")
      .pipe(map((res: any) => res));
  }
  getAcademySpecificBatches(id) {
    return this.httpClient
      .get(
        AppSettings.API_ENDPOINT +
          `/academies/getAcademySpecificBatches?id=${id}`
      )
      .pipe(map((res: any) => res));
  }

  ChnagePassword(data) {
    return this.httpClient
      .post(AppSettings.API_ENDPOINT + "academies/changePassword", data)
      .pipe(map((res: any) => res));
  }

  updateParentAcademyPassword(data) {
    return this.httpClient
      .post(AppSettings.API_ENDPOINT + "parent_academies/changePassword", data)
      .pipe(map((res: any) => res));
  }

  getNewNotificationsCount(data) {
    return this.httpClient
      .post(AppSettings.API_ENDPOINT + "notifications/getUnSeenPaymentNotificationsOfCRM", data)
      .pipe(map((res: any) => res));
  }

  // parent Academy
  createParentAcademy(academyDetails) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT + "/parent_academies/createParentAcademy",
        academyDetails
      )
      .pipe(map((res: any) => res));
  }
  updateParetAcademy(academyDetails) {
    return this.httpClient
      .post(
        AppSettings.API_ENDPOINT + "/parent_academies/updateParetAcademy",
        academyDetails
      )
      .pipe(map((res: any) => res));
  }
}

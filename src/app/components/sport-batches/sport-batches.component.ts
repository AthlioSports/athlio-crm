import { Component, OnInit, ViewChild } from '@angular/core';
import { MasterDataService } from '../../services/master_data/master-data.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient} from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { AppSettings } from '../../apiUrls';
import { Subject } from 'rxjs';
import { ValidationsService } from './../../services/validations/validations.service';
class sportData {
  slNo : number;
  name : string;
  created_date : string;
  id : string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-sport-batches',
  templateUrl: './sport-batches.component.html',
  styleUrls: ['./sport-batches.component.css']
})
export class SportBatchesComponent implements OnInit {
  batchName : any = '';
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  dtSportsList : sportData[];
  edit_id : any = '';
  showsportEdit : boolean = false;

  constructor(
    private masterDataService : MasterDataService,
    private toastr:ToastrService,
    private httpClient : HttpClient,
    private validationsService: ValidationsService
    ) { }

  deleteId : string = '';
	@ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  ngOnInit() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      retrieve: true,
      order: [[ 1, "asc" ]],
      ajax: (dataTablesParameters: any, callback) => {
        that.httpClient
          .post<DataTablesResponse>(
            AppSettings.API_ENDPOINT + 'student_batches/getSportBatches',
            dataTablesParameters
          ).subscribe((resp : any)=> {
            this.dtSportsList = resp.data.data;
            callback({
              recordsTotal: resp.data.recordsTotal,
              recordsFiltered: resp.data.recordsFiltered,
              data: []
            });
          });
      },
      columns: [
        { title : 'S.No',data: 'slNo', orderable : false},
        { title : 'Name',data: 'name' },
        { title : 'Added On',data: 'created_date' },
        { title : 'Action',data: '', orderable : false }
      ]
     
    };
    this.onActivate(event);
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  
  addSportbatches(){
    if(!this.batchName || !/\S/.test(this.batchName)){
        this.toastr.error('Batch  Name is a mandatory field.');
        return;
    }
    if (this.batchName.length < 3) {
      this.toastr.error('Batch Name should have atleast 3 characters.');
      return;
    }
    else{
      this.masterDataService.addSportbatches(this.batchName).subscribe((data : any) =>{
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
        // this.getMasterSports();
        this.batchName = '';
        this.toastr.success('Batch Added successfully');
      },error =>{
        this.toastr.error(error.error.error.message);
      });
    }
  }

  edidSport(id){
    this.dtSportsList.filter((sport: any) => {
     
      if(sport._id == id){
        this.edit_id = id;
        this.batchName = sport.name;
        return sport.name;
      }
    })
    this.showsportEdit = true;
  }

  updatebatchSport(id){
    if(this.edit_id == '' || !this.batchName || !/\S/.test(this.batchName)){
        this.toastr.error('Batch Name is a mandatory field.');
        return;
    }
    if (this.batchName.length < 3) {
      this.toastr.error('Batch Name should have atleast 3 characters.');
      return;
    }else{
      this.masterDataService.updatebatchSport({id:this.edit_id, name : this.batchName}).subscribe((data : any) =>{
        // this.getMasterSports();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
        this.edit_id = '';
        this.batchName = '';
        this.showsportEdit = false;
        this.toastr.success('Sport Batch Name updated successfully'); 
      },error =>{
        this.toastr.error(error.error.error.message);
      });
    }
  }

  deletebatchsport(id){
    if (id) {
    this.masterDataService.deletebatchsport(id).subscribe((data : any) =>{
      // this.masterSportsList = data.data;
      // this.dtOptions.reloadData();
      // this.getMasterSports();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
      this.toastr.success('Sport Batch Name removed successfully');
    },error =>{
      this.toastr.error(error.error.error.message);
    });
  }
}

alphabetsAndSpaceOnly(e){
  return this.validationsService.alphabetsAndSpaceOnly(e);
}

}

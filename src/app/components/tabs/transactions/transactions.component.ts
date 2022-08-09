import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master.service';


export interface UserData {
  id: string;
  name: string;
  //progress: string;
  //fruit: string;
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements  OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'id', 'paid', 'by', 'method', 'to', 'status', 'benifit', 'manage'
  ];
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  phenomenon = false;
  searchType = "last"

  constructor(
    public auth: AuthService,
    public master: MasterService,
  ) { 
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.execute();
    }, 3000)
  }

  applyFilter(event: Event) {
    if(this.searchType == 'last'){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    }
  }

  startSearch(setX:boolean, key:string, query:any, value:any){
    if(!value){

    }else{
      console.log(key, value)
      if(setX){
        if( key == "id" && !value || key == "name" && !value || key == "email" && !this.auth.resource.invalidEmail(value) || key == "phone" && this.auth.resource.invalidPhone(value) ){
          if(key == "id" && !value){ this.auth.resource.startSnackBar("Invalid ID"); }
          if(key == "name" && !value){ this.auth.resource.startSnackBar("Invalid Name"); }
          if(key == "email" && !this.auth.resource.invalidEmail(value)){ this.auth.resource.startSnackBar("Invalid Email"); }
          if(key == "phone" && this.auth.resource.invalidPhone(value)){ this.auth.resource.startSnackBar("Invalid Phone"); }
        }else{
          this.master.getCustomPaymentList(55, key, "==", value).subscribe((stores:any) => {
              //console.log("List: ", stores);
              this.dataSource = new MatTableDataSource(stores);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
          })
        }
      }else{
        this.master.getCustomPaymentList(55, key, query, value).subscribe((stores:any) => {
            //console.log("List: ", stores);
            this.dataSource = new MatTableDataSource(stores);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        })
      }

    }
  }

  execute(){
    this.master.getPaymentList(55).subscribe((payments:any) => {
        console.log("List: ", payments);
        this.dataSource = new MatTableDataSource(payments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    })
  }

  deleteTranz(id:string){
    if(id){
      this.master.deletePayment(id)
    }
  }


}


import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master.service';


export interface UserData {
  uid: string;
  name: string;
  by:string;

  acBalC: number;
acBalCr: number;

sin:any;

  //progress: string;
  //fruit: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements  OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'uid', 'name', 'sin', 'balance', 'reserve', 'user' //'progress', 'fruit'
  ];
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  phenomenon = false;
  searchType = "last"

  constructor(
    public auth: AuthService,
    private master:MasterService
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
        if( key == "uid" && !value || key == "email" && !this.auth.resource.invalidEmail(value) || key == "phone" && this.auth.resource.invalidPhone(value) ){
          if(key == "uid" && !value){ this.auth.resource.startSnackBar("Invalid ID"); }
          if(key == "email" && !this.auth.resource.invalidEmail(value)){ this.auth.resource.startSnackBar("Invalid Email"); }
          if(key == "phone" && this.auth.resource.invalidPhone(value)){ this.auth.resource.startSnackBar("Invalid Phone"); }
        }else{
          this.master.getCustomUserList(55, key, "==", value).subscribe((stores:any) => {
              //console.log("List: ", stores);
              this.dataSource = new MatTableDataSource(stores);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
          })
        }
      }else{
        this.master.getCustomUserList(55, key, query, value).subscribe((stores:any) => {
            //console.log("List: ", stores);
            this.dataSource = new MatTableDataSource(stores);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        })
      }

    }
  }

  execute(){
    this.master.getUserList(55).subscribe((stores:any) => {
        console.log("List: ", stores);
        this.dataSource = new MatTableDataSource(stores);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    })
  }

}


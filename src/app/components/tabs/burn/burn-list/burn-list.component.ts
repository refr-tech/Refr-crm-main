import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master.service';


export interface UserData {
  // id: string;
  // title: string;
  // cost: string;
  // sin: string;
  id: string;
  title: string;
  category: string;
  status: string;
  by:string;
  cost:number,
  price:number,
  code:string,
  flash:string,
  //download: string;
  //progress: string;
  //fruit: string;
}

@Component({
  selector: 'app-burn-list',
  templateUrl: './burn-list.component.html',
  styleUrls: ['./burn-list.component.scss']
})
export class BurnListComponent implements  OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'id', 'title', 'price', 'cost', 'code', 'flash',  'product'
    //'id', 'name', 'status', 'stage',  'user', 'store' //'progress', 'fruit'
    //'title', 'cost', 'download'  //'progress', 'fruit'
  ];
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  phenomenon = false;
  searchType = "last"

  // setStore:any = null;

  // userID = "";
  // storeID = "";
  productCat:string[] = [];
  productListX:any[] = []

  makingChanges = false;

  constructor(
    public auth: AuthService,
    private master: MasterService
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
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  execute(){


    this.master.getBurnProductList( 55 ).subscribe((p:any) => {
        console.log("List: ", p);
        this.dataSource = new MatTableDataSource(p);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;


      if(!p || p.length == 0){
        this.productCat = [];
      }else{
        this.productCat = [];
        this.productListX = p;
        for (let i = 0; i < p.length; i++) {
          if(!this.productCat.includes(p[i].category)){
            this.productCat.push(p[i].category)
          }
        }
      }


    })

  }


  startSearch(setX:boolean, key:string, query:any, value:any){
    if(!value){

    }else{
      console.log(key, value)
      if(setX){
        if( key == "id" && !value || key == "email" && !this.auth.resource.invalidEmail(value) || key == "phone" && this.auth.resource.invalidPhone(value) ){
          if(key == "id" && !value){ this.auth.resource.startSnackBar("Invalid ID"); }
          if(key == "email" && !this.auth.resource.invalidEmail(value)){ this.auth.resource.startSnackBar("Invalid Email"); }
          if(key == "phone" && this.auth.resource.invalidPhone(value)){ this.auth.resource.startSnackBar("Invalid Phone"); }
        }else{
          this.master.getCustomBurnProductList(55, key, "==", value).subscribe((stores:any) => {
              //console.log("List: ", stores);
              this.dataSource = new MatTableDataSource(stores);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
          })
        }
      }else{
        this.master.getCustomBurnProductList(55, key, query, value).subscribe((stores:any) => {
            //console.log("List: ", stores);
            this.dataSource = new MatTableDataSource(stores);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        })
      }

    }
  }

  flashSale(id:string, cng:boolean){
    if(id){
      console.log(id, cng)
      this.makingChanges = true;
      this.master.changeFlash(id, cng).then(() => {
        this.makingChanges = false;
      })
    }
  }

}


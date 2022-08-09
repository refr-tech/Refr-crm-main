import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master.service';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';


export interface UserData {
  id: string;
  name: string;
  //progress: string;
  //fruit: string;
}

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements  OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'id', 'name', 'cbDir', 'cbExi', 'cbNew', 'type', 'range', //'progress', 'fruit'
  ];
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  phenomenon = false;
  searchType = "last"

  setStore:any = null;

  userID = "";
  storeID = "";
  // productCat:string[] = [];
  // productListX:any[] = []

  constructor(
    public auth: AuthService,
    private master: MasterService,
    private actRoute: ActivatedRoute
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
    //const storeID:string = "8B9ozj7aTPvywkIvVWiK";
    const storeID:string = this.actRoute.snapshot.params["storeID"];
    if(!storeID){

    }else{

    this.master.getStoreByID(storeID).then(storeRef => {
     const store:any = storeRef.exists() ? storeRef.data() : null;
      if(!store){

      }else{
        this.setStore = {
          type:store.type,
          name:store.name,
          cat:store.cat, subCat:store.subCat
        }


    this.master.getCampaignList(storeID //, 55
      ).subscribe((p:any) => {
        console.log("List: ", p);
        this.dataSource = new MatTableDataSource(p);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.userID = store.by;
        this.storeID = store.id;

      // if(!p || p.length == 0){
      //   this.productCat = [];
      // }else{
      //   this.productCat = [];
      //   this.productListX = p;
      //   for (let i = 0; i < p.length; i++) {
      //     if(!this.productCat.includes(p[i].category)){
      //       this.productCat.push(p[i].category)
      //     }
      //   }
      // }


    })

      }
    })

    }


    // this.auth.getProductList(100).subscribe((users:any) => {
    //     console.log("List: ", users);
    //     this.dataSource = new MatTableDataSource(users);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    // })
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
          this.master.getCustomCampaignList(55, key, "==", value).subscribe((stores:any) => {
              //console.log("List: ", stores);
              this.dataSource = new MatTableDataSource(stores);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
          })
        }
      }else{
        this.master.getCustomCampaignList(55, key, query, value).subscribe((stores:any) => {
            //console.log("List: ", stores);
            this.dataSource = new MatTableDataSource(stores);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        })
      }

    }
  }




  createCampaign(){
    if(!this.userID){

    }else{
    let w = (this.auth.resource.getWidth - 16) + 'px';
    let h = (this.auth.resource.getHeight - 16) + 'px';
    const refDialog = this.auth.resource.dialog.open(CreateCampaignComponent, {
      width: w, minWidth: "320px", maxWidth: "480px",
      height:h,
      data:{enableDirect:true, uid: this.userID},
      disableClose: true,
      panelClass:"dialogLayout"//, autoFocus:false
    });
    refDialog.afterClosed().subscribe(ref =>{
      console.log(ref)
      // if(ref.id){
      //   // if(this.userData){
      //   //   this.execute(this.userData);
      //   // }
      // }
    })
    }
    
  }

}


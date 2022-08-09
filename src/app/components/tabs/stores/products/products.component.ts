import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master.service';
import { CreateProductComponent } from './create-product/create-product.component';
import { UploadProductComponent } from './product-search/upload-product/upload-product.component';


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
  code:string
  //download: string;
  //progress: string;
  //fruit: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements  OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'id', 'title', 'price', 'cost', 'code', 'status',  'terminate',  'product'
    //'id', 'name', 'status', 'stage',  'user', 'store' //'progress', 'fruit'
    //'title', 'cost', 'download'  //'progress', 'fruit'
  ];
  dataSource!: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  phenomenon = false;
  searchType = "last"

  setStore:any = null;

  userID = "";
  storeID = "";
  productCat:string[] = [];
  productListX:any[] = []

  makingChanges = false;

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


    this.master.getProductList(storeID //, 55
      ).subscribe((p:any) => {
        console.log("List: ", p);
        this.dataSource = new MatTableDataSource(p);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.userID = store.by;
        this.storeID = store.id;

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
          this.master.getCustomProductList(55, key, "==", value).subscribe((stores:any) => {
              //console.log("List: ", stores);
              this.dataSource = new MatTableDataSource(stores);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
          })
        }
      }else{
        this.master.getCustomProductList(55, key, query, value).subscribe((stores:any) => {
            //console.log("List: ", stores);
            this.dataSource = new MatTableDataSource(stores);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        })
      }

    }
  }

  uploadBulk(){
    const productList = this.productListX;
    this.createBulk(productList)
  }

  createBulk(productList: any[]){
    let w = (this.auth.resource.getWidth - 16) + "px";
    let h = (this.auth.resource.getHeight - 16) + "px";
    console.log(this.userID, this.storeID, this.productCat)

    if(this.userID && this.storeID){
    const refDialog = this.auth.resource.dialog.open(UploadProductComponent, {
      width: w, maxWidth: "480px",
      height: h, maxHeight: "340px",
      data:{
        userID: this.userID,
        storeID: this.storeID,
        //cat:,
        productCat: this.productCat,
      },
      disableClose: true, panelClass:"dialogLayout"//, autoFocus:false
    })
    refDialog.afterClosed().subscribe(ref =>{
      if(!ref){

      }else{
        this.auth.resource.startSnackBar("Creating " + ref.length + " Products...");
        console.log("MANHANDLE: ", ref, productList)

        if(productList){
          if(productList.length == 0){
            this.startBulkUpload(ref);
          }else{
        let newALL = true;

    for (let i = 0; i < ref.length; i++) {
      const element = ref[i];

      if( productList.findIndex((p:any) => {
        let x = element.productName == p.title;
        console.log("GIRL", element.productName, p.title, x);
        return x;
      }) >= 0 ){
        newALL = false;
        console.log("MATCH")
      }

      if( ref.length == (i+1) ){
        if(!newALL){
          this.auth.resource.startSnackBar("Products with same name already exist.");
        }else{
          this.startBulkUpload(ref);
        }
      }

    }
          }
        }
      }
    })
    }

  }


  startBulkUpload(data:any[]){
    const products = [];

    console.log(data)

    for (let p = 0; p < data.length; p++) {
      const storeProduct = data[p];
      this.addNewProduct(storeProduct)
      .then((ref:any) => {
        this.auth.resource.startSnackBar("The new product been created.");
      }).catch(err => {
        console.log(err)
      }).finally(() => {

      if(data.length == (p+1) ){
        // if(this.userData){
        //   this.execute(this.userData);
        // }
      }
      })
    }

  }

  addNewProduct(storeProduct:any){
    return this.master.addProduct(storeProduct, [])
  }

  createProduct(){
    if(!this.userID){

    }else{
    let w = (this.auth.resource.getWidth - 16) + 'px';
    let h = (this.auth.resource.getHeight - 16) + 'px';
    const refDialog = this.auth.resource.dialog.open(CreateProductComponent, {
      width: w, minWidth: "320px", maxWidth: "480px",
      height:h,
      data:{enableDirect:true, uid: this.userID},
      disableClose: true,
      panelClass:"dialogLayout"//, autoFocus:false
    });
    refDialog.afterClosed().subscribe(ref =>{
      if(ref.id){
        // if(this.userData){
        //   this.execute(this.userData);
        // }
      }
    })
    }
  }

  deleteProduct(id:string){
    this.makingChanges = true;
    if( !this.storeID || !id ){
      this.makingChanges = false;
    }else{
      this.master.deleteProduct(this.storeID, id).then(() => {
        this.makingChanges = false;
        this.auth.resource.startSnackBar("The product has been terminated.");
      }).catch(err => {
        this.makingChanges = false;
        this.auth.resource.startSnackBar("issue: " + err);
      })
    }
  }

}


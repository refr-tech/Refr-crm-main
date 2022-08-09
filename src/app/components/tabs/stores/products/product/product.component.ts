import { Component, OnInit } from '@angular/core';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { AuthService } from 'src/app/services/auth.service';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Observable, of, take } from 'rxjs';
import { MasterService } from 'src/app/services/master.service';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  productID = "";
  storeID = "";

  store$: Observable<any> = of();

  storeProduct = {
    storeID:"", by:"",

    productName:"",
    description:"",
    price:<number><unknown>undefined,
    cost:<number><unknown>undefined,
    quota:<number><unknown>undefined,
    category:"",
    code:"",
    variants:<any[]>[],

    warranty:true,
    content:true,
    //exchange:true,

  }

  burnProduct = {
    reqBurn: false,
    burn: false,
    flash: false,

    pic:"",
    pics:<string[]>[],
    cat:"",
    subCat:"",
    cost:<number><unknown>undefined,
    brand:"",
    short:"",
    spec:"",
    description:"",
    highlight:"",

    relate:[]
  }


  productCurrent = {
    productName:"",
    description:"",
    price:<number><unknown>undefined,
    cost:<number><unknown>undefined,
    quota:<number><unknown>undefined,
    category:"",
    code:"",
    variants:<any[]>[],

    warranty:true,
    content:true,
    //exchange:true,
  };

    submitFirst = false;
    disableForm = false;

    imageUrlLogo:any[] = [];
    imageUrlLogoBurn:any[] = [];

    choose = {
      size:"",
      color:"",
      material:"",
      titles: <string[]>[],
      title:"", about:"",
      //COD: false
    }

    categoryList:any[] = []

  constructor(
    public auth: AuthService,
    private master: MasterService,
    private actRoute: ActivatedRoute
  ) { 


    this.master.getBurnCatsList().pipe(take(1)).subscribe(cat => {
      console.log(cat)
      this.categoryList = cat;
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.execute();
    }, 3000);
  }

  
  async execute(){
    this.productID = "";
    this.storeID = "";
  
    this.store$ = of();
  
    this.storeProduct = {
      storeID:"", by:"",
  
      productName:"",
      description:"",
      price:<number><unknown>undefined,
      cost:<number><unknown>undefined,
      quota:<number><unknown>undefined,
      category:"",
      code:"",
      variants:<any[]>[],
  
      warranty:true,
      content:true,
      //exchange:true,
  
    }
  
    this.burnProduct = {
      reqBurn: false,
      burn: false,
      flash: false,
  
      pic:"",
      pics:<string[]>[],
      cat:"",
      subCat:"",
      cost:<number><unknown>undefined,
      brand:"",
      short:"",
      spec:"",
      description:"",
      highlight:"",
  
      relate:[]
    }
  
  
    this.productCurrent = {
      productName:"",
      description:"",
      price:<number><unknown>undefined,
      cost:<number><unknown>undefined,
      quota:<number><unknown>undefined,
      category:"",
      code:"",
      variants:<any[]>[],
  
      warranty:true,
      content:true,
      //exchange:true,
    };
  
    this.submitFirst = false;
      this.disableForm = false;
  
      this.imageUrlLogo = [];
      this.imageUrlLogoBurn = [];
  
      this.choose = {
        size:"",
        color:"",
        material:"",
        titles: <string[]>[],
        title:"", about:"",
        //COD: false
      }
  
      //this.categoryList = []


    const id = this.actRoute.snapshot.params["id"];
    //const id = "PJSAKPC4fm8eMaZr9Kw5";
    if(!id){

    }else{

    this.master.getProductByID(id).then(productRef => {
      const product:any = productRef.exists() ? productRef.data() : null;
      if(!product){
        

      }else{
        this.productID = product["id"];


        this.master.getStoreByID( product["sid"] ).then(storeRef => {
          const store:any = storeRef.exists() ? storeRef.data() : null;
          if(!store){
    
          }else{
            this.storeID = store["id"];
            this.store$ = of(store);

          }
        })
        

        this.storeProduct = {
          storeID:product["sid"], by:product["by"],
      
          productName:product["title"],
          description:product["description"],
          price:product["price"],
          cost:product["cost"],
          category:product["category"],
          code:product["code"],
          variants:product["variants"],
      
          warranty:product["warranty"],
          content:product["content"],

          quota:product["quota"] || 0,
          //exchange:true,
        }

        this.productCurrent = {
      
          productName:product["title"],
          description:product["description"],
          price:product["price"],
          cost:product["cost"],
          category:product["category"],
          code:product["code"],
          variants:product["variants"],
      
          warranty:product["warranty"],
          content:product["content"],

          quota:product["quota"] || 0,
          //exchange:true,
        }
        if(product["banners"].length > 0){
          this.imageUrlLogo = product["banners"]
        }

        if(product["burn"] == true || product["reqBurn"] == true){


          this.burnProduct = {
            reqBurn: product["reqBurn"] || false,
            burn: product["burn"] || false,
            flash:product["burn"] ? product["flash"] : false,

            pic:product["burnPic"] ? product["burnPic"] : "",
            pics:product["burnPics"] ? product["burnPics"] : [],
            cat: product["burnCat"] ? product["burnCat"] : "",
            subCat:product["burnCatSub"] ? product["burnCatSub"] : "",
            cost:<number><unknown> product["costBurn"] ? product["costBurn"] : (product["cost"] - (product["cost"] * (10/100))),
            brand:product["burnBrand"] ? product["burnBrand"] : "",
            short:product["burnDecShort"] ? product["burnDecShort"] : "",
            spec:product["burnSpec"] ? product["burnSpec"] : "",
            description:product["burnDec"] ? product["burnDec"] : "",
            highlight:product["burnHigh"] ? product["burnHigh"] : "",

            relate:product["burnRelate"] ? product["burnRelate"] : [],
          }

        }


      }
    })

    }
  
  }

  async takePicture(type:string){
    if(!this.disableForm){
      const image = await Camera.getPhoto({
        quality: 100,
        height: 300,
        width: 300,
        allowEditing: false,
        source:CameraSource.Camera,
        resultType: CameraResultType.Uri
      });
      console.log("image", image)
      const imageUrl = image.webPath || "";
      if(imageUrl){
      this.startCropper(imageUrl, type);
      console.log("image", imageUrl)
      }else{
        console.log("No image")
      }
    }
  }
  async choosePhoto(type:string){
    if(!this.disableForm){
      const image = await Camera.pickImages({
        quality: 100,
        height: 300,
        width: 300,
        limit: 1,
      });
      const imageUrl = image.photos[0].webPath || "";
      if(imageUrl){
      this.startCropper(imageUrl, type);
      console.log("image", imageUrl)
      }else{
        console.log("No image")
      }
    }
  }

  startCropper(webPath:string, type:string){
    if(!this.disableForm){
      let isPhone = this.auth.resource.getWidth < 768;
      let w = isPhone ? this.auth.resource.getWidth + "px" : "480px";
      let h = isPhone ? this.auth.resource.getHeight + "px" : "";
      const refDialog = this.auth.resource.dialog.open(CropperComponent, {
        width: w, minWidth: "320px", maxWidth: "480px",
        height:h,
        data:{webPath:webPath, type:'logo'},
        disableClose: true, panelClass:"dialogLayout"//, autoFocus:false
      });
      refDialog.afterClosed().subscribe(result =>{
        console.log("cropper closed")
        if(!result.success){
          if(result.info){
            console.log(result.info);
            this.auth.resource.startSnackBar(result.info)
          }
        }else{

if( type == 'logo'){
          this.master.addProductBanners(this.productID, result.croppedImage ).then(ref => {
            if(!ref || !ref.success){
              this.auth.resource.startSnackBar("Upload Failed!");
              this.disableForm = false;
            }else{
              //this.storeBannersList.push(ref.url)
              this.imageUrlLogo.push(ref.url);

              // if(this.storeBannersList.length == 1){
              //   this.storeBannersActive = this.storeBannersList[0];
              // }
              this.auth.resource.startSnackBar("Product Pics Update Under Review!");
              this.disableForm = false;
            }
          });
}

if( type == 'logoBurn'){
          this.master.addProductBurnBanners(this.productID, result.croppedImage ).then(ref => {
            if(!ref || !ref.success){
              this.auth.resource.startSnackBar("Upload Failed!");
              this.disableForm = false;
            }else{
              //this.storeBannersList.push(ref.url)
              this.burnProduct.pics.push(ref.url);
              if(this.burnProduct.pics.length == 1){
                this.burnProduct.pic = ref.url;
              }

              // if(this.storeBannersList.length == 1){
              //   this.storeBannersActive = this.storeBannersList[0];
              // }
              this.auth.resource.startSnackBar("Product Pics Update Under Review!");
              this.disableForm = false;
            }
          });
}

            //this.imageUrlLogo.push(result.croppedImage);
        }
      })
    }
  }

  removeProductBanner( type:string, resultImage:string ){
    
    this.disableForm = true;

if( type == 'logo'){
    this.master.removeProductBanners(this.productID, resultImage ).then(() => {
      //this.storeBanner = resultImage;
      const ind = this.imageUrlLogo.indexOf(resultImage);
      this.imageUrlLogo.splice( ind, 1 );
      // if(this.storeBannersList.length > 0){
      //   this.storeBannersActive = this.storeBannersList[0];
      // }else{
      //   this.storeBannersActive = "";
      // }
      this.auth.resource.startSnackBar("Pic removed.");
      this.disableForm = false;
      //this.auth.resource.last.enable();
    });
}

if( type == 'logoBurn'){
    this.master.removeProductBurnBanners(this.productID, resultImage ).then(() => {
      //this.storeBanner = resultImage;
      const ind = this.imageUrlLogo.indexOf(resultImage);
      this.imageUrlLogo.splice( ind, 1 );
      // if(this.storeBannersList.length > 0){
      //   this.storeBannersActive = this.storeBannersList[0];
      // }else{
      //   this.storeBannersActive = "";
      // }
      this.auth.resource.startSnackBar("Pic removed.");
      this.disableForm = false;
      //this.auth.resource.last.enable();
    });
  }

    
  }

  getVariants(type:string){
    return this.storeProduct.variants.filter((x:any) => {
      return x.type == type;
    })
  }
  getVariant(type:string, name:string){
    return this.storeProduct.variants.filter((x:any) => {
      return x.name.toLowerCase() == name.toLowerCase() && x.type == type;
    })
  }

  addNewVariant(type:string, x:string, title:string){
    const i = this.storeProduct.variants.filter((v:any) => {
      return v.name.toLowerCase() == x.toLowerCase() && v.type == type;
    })

    if(i.length > 0){
      if(type == 'variant'){
        const iX = this.storeProduct.variants.filter((v:any) => {
          return v.title?.toLowerCase() == title.toLowerCase() && v.type == type; //&& v.name == x;
        })
        console.log("i Got Hit", iX.length)
    
        if(iX.length == 1){
          console.log("i Got Hit 1")
          this.choose.titles.splice( this.choose.titles.findIndex(v => v.toLowerCase() == title.toLowerCase()), 1 );
        }
        this.storeProduct.variants.splice( this.storeProduct.variants.findIndex(v => v.name.toLowerCase() == x.toLowerCase() && v.title?.toLowerCase() == title.toLowerCase() && v.type == type ), 1 );

      }else{
        this.storeProduct.variants.splice( this.storeProduct.variants.findIndex(v => v.name.toLowerCase() == x.toLowerCase() && v.type == type && !v.title ), 1 );
      }
    }else{

      if(type == 'variant'){
        if(type && x && title){
          const data = {type, name:x, title:title};
          this.storeProduct.variants.push(data);
          if( !this.choose.titles.includes(title) ){
            this.choose.titles.push(title);
          }
        }else{
          console.log("enter Proper")
        }
      }else{
        const data = {type, name:x};
        this.storeProduct.variants.push(data);
      }
      
    }
  }
  removeVariantBulk( type:string, title:string ){
    const b = this.storeProduct.variants.filter((v:any) => {
      return v.title.toLowerCase() == title.toLowerCase() && v.type == type;
    });
    for (let i = 0; i < b.length; i++) {
      this.addNewVariant(b[i].type, b[i].name, title)
    }
  }

  updateStoreProduct(){
    console.log(this.storeProduct)
    this.submitFirst = true;
    this.disableForm = true;

    if(
      !this.storeProduct.storeID ||
      !this.storeProduct.productName ||
      !this.storeProduct.description ||
      !this.storeProduct.price || this.invalidRate(this.storeProduct.price) ||
      !this.storeProduct.cost || this.invalidRate(this.storeProduct.cost) ||
      this.storeProduct.price < this.storeProduct.cost ||
      !this.storeProduct.category ||
      !this.storeProduct.code 
    ){
      if(!this.storeProduct.productName){
        this.auth.resource.startSnackBar("Product name is required");
      }else{
        if(!this.storeProduct.description){
          this.auth.resource.startSnackBar("Product description is required");
        }else{
          if(!this.storeProduct.price || this.invalidRate(this.storeProduct.price)){
            this.auth.resource.startSnackBar( !this.storeProduct.price ? "Market price is required":"Market price must be a number.");
          }else{
            if(!this.storeProduct.cost || this.invalidRate(this.storeProduct.cost)){
              this.auth.resource.startSnackBar( !this.storeProduct.price ? "Selling price is required":"Selling price must be a number.");
            }else{
              if(this.storeProduct.price < this.storeProduct.cost){
                this.auth.resource.startSnackBar("Selling price must be greater or equal to Market price.");
              }else{
                if(!this.storeProduct.category){
                  this.auth.resource.startSnackBar("Product category is required");
                }else{
                  if(!this.storeProduct.code){
                    this.auth.resource.startSnackBar("Product code is required");
                  }else{
                    this.auth.resource.startSnackBar("Invalid Fields");
                  }
                }
              }
            }
          }
        }
      }
      this.disableForm = false;
    }else{
      this.updateProduct();
    }
  }


  updateProduct(){
    // this.imageUrlLogo
    this.master.updateProduct(this.productID, this.storeProduct).then((ref:any) => {
      this.auth.resource.startSnackBar("The product has been updated.");
      this.disableForm = false;
      // if(this.enableDirect){
      //   //this.dialogRef.close({id:ref.id})
      // }else{
      //   this.auth.resource.router.navigate(["/dash"])
      // }
    }).catch(err => {
      console.log(err)
    })
  }

  invalidRate(rate:number){ const newNum  = new FormControl(rate, [ Validators.pattern('^[0-9]+$') ]); return newNum.invalid; }
  invalidPhone(phone:string){ const newNum  = new FormControl(phone, [ Validators.pattern('^[0-9]+$') ]); return newNum.invalid; }
  get checkIfCan(){
    return this.storeProduct.productName == this.productCurrent.productName &&
    this.storeProduct.description == this.productCurrent.description &&
    this.storeProduct.price == this.productCurrent.price &&
    this.storeProduct.cost == this.productCurrent.cost &&
    this.storeProduct.category == this.productCurrent.category &&
    this.storeProduct.code == this.productCurrent.code &&
    //this.storeProduct.variants.toString() == this.productCurrent.variants.toString() &&
    
    this.storeProduct.warranty == this.productCurrent.warranty &&
    this.storeProduct.content == this.productCurrent.content &&

    this.storeProduct.quota == this.productCurrent.quota;
  }
  

  burnRate(){
    if(!this.burnProduct.cost || !this.productCurrent.cost || this.productCurrent.cost < this.burnProduct.cost ){
      return;
    }else{
      return (this.burnProduct.cost - this.productCurrent.cost) / this.productCurrent.cost * 100;
    }
  }

  burnRateX(rate:number){
    if( !this.productCurrent.cost ){
      return;
    }else{
      return (this.productCurrent.cost - (this.productCurrent.cost * (rate/100)));
    }
  }

  setRate(rate:number){
    if(this.burnProduct?.cost > 0){
      const x:any = this.burnRateX(rate)
      if(x){
        this.burnProduct.cost = x;//Math.round(x);
      }
    }
  }


  updateStoreProductBurn(){
    this.disableForm = true;
    if(this.burnProduct.pics.length == 0){
      this.auth.resource.startSnackBar("Please select banner");
      this.disableForm = false;
    }else{
      this.burnProduct.pic = this.burnProduct.pics[0];

      if(
        !this.burnProduct.pic || 
        !this.burnProduct.cat || 
        !this.burnProduct.subCat || 
        !this.burnProduct.cost || 
        this.productCurrent.cost < this.burnProduct.cost || 
        !this.burnProduct.brand || 
        !this.burnProduct.short || 
        !this.burnProduct.spec || 
        !this.burnProduct.description || 
        !this.burnProduct.highlight 
      ){
        this.disableForm = false;
        if( this.productCurrent.cost < this.burnProduct.cost ){
          this.auth.resource.startSnackBar("Burn cost must be lower than current Cost.");
        }else{
          this.auth.resource.startSnackBar("Enter everything for burn");
        }
      }else{
        const data = {
          burnPic:this.burnProduct.pic,
          burnPics:this.burnProduct.pics,
          burnCat:this.burnProduct.cat,
          burnCatSub:this.burnProduct.subCat,
          costBurn:this.burnProduct.cost,
          burnBrand:this.burnProduct.brand,
          burnDecShort:this.burnProduct.short,
          burnSpec:this.burnProduct.spec,
          burnDec:this.burnProduct.description,
          burnHigh:this.burnProduct.highlight,
      
          relate:[],
          flash:this.burnProduct.flash,
        }
        // this.imageUrlLogo
        this.master.updateProductBurn(this.productID, data).then((ref:any) => {
          this.auth.resource.startSnackBar("The product has been added to Burn.");
          this.disableForm = false;
        }).catch(err => {
          console.log(err)
          this.disableForm = false;
        })

      }
    }
  }

  denyRequest(){
    console.log("denyRequest",this.productID)
    if(this.productID){
      console.log("denyRequest")
      this.disableForm = true;
      this.master.denyRequest(this.productID).then(() => {
        this.disableForm = false;
        this.execute()
      })
    }
  }

  reqEx(){
    if(this.productID){
      console.log("reqEx")
    this.disableForm = true;
    this.master.reqBurn(this.productID).then(() => {
      this.disableForm = false;
      this.execute()
    })
    }
  }

}

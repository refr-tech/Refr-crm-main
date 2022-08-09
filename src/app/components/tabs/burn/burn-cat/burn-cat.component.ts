import { Component, OnInit } from '@angular/core';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master.service';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-burn-cat',
  templateUrl: './burn-cat.component.html',
  styleUrls: ['./burn-cat.component.scss']
})
export class BurnCatComponent implements OnInit {


  bannerX:any = {url:"", img:""}; //= {url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"};
  newINX:any = {url:"", img:""}; //= {url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"};
  spotX:any = {url:"", img:""}; //= {url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"};

  cat:any[] = [
    /*
    {


    tit:"AccessoriesX", 
    img:"https://app.refr.club/assets/aditya/accessories.webp", 
    id:"cat-accessories",
    //url:"/burn/accessories",
    subCat:[
      {id:"footwear", tit:"Footwear"},
      {id:"bags_and_wallet", tit:"Bags & Wallet"},
      {id:"jewellery", tit:"Jewellery"},
      //{id:"clothing", tit:"Clothing"},
    ],

    banners:[
      {url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"},
      {url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"},
    ],
    newIN:[
      {url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"},
      {url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"},
    ],
    spot:[
      {url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"},
      {url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"},
      {url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"},
      {url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"},
      {url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"},
      {url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"},
    ]
  }
  */
]

  cN = {
    tit:"", 
    id:"",
    img:"", 
  }

  cU:any = null;
/*
  c = {


    tit:"", 
    id:"",
    img:"", 
    //img:"https://app.refr.club/assets/aditya/accessories.webp", 
    //url:"/burn/accessories",
    subCat:[
      //{id:"footwear", tit:"Footwear"},
      //{id:"bags_and_wallet", tit:"Bags & Wallet"},
      //{id:"jewellery", tit:"Jewellery"},
      //{id:"clothing", tit:"Clothing"},
    ],

    banners:<any[]>[
      //{url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"},
    ],
    newIN:<any[]>[
      {url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"},
    ],
    spot:<any[]>[
      {url:"", img:"https://app.refr.club/assets/aditya/burn-banner-1.svg"},
    ]
  }
*/

  createNew = false;
  createUpdate = false;
  makingChanges = false;

  constructor(
    public auth: AuthService,
    private master: MasterService
  ) { 
    this.execute()
  }

  ngOnInit(): void {
  }

  execute(){
    this.master.getBurnCatsList().subscribe(cX => {
      if(!cX){
      }else{
        this.cat = cX;
      }
    })
  }

  createNewCat(){
    if(!this.createNew){
      this.cN.id = ""; 
      this.cN.tit = "";
      this.cN.img = "";
      this.createNew = true;
      this.createUpdate = false;
    }else{
      this.createNew = false;
    }
  }

  updateOldCat(c:any){
    if(!this.createUpdate){
      this.cU = c;
      this.createNew = false;
      this.createUpdate = true;
      if(this.cU.banners.length > 0){
        this.bannerX = this.cU.banners[0];
      }
      if(this.cU.newIN.length > 0){
        this.newINX = this.cU.newIN[0];
      }
      if(this.cU.spot.length > 0){
        this.spotX = this.cU.spot[0];
      }
    }else{
      this.createUpdate = false;
    }
  }

  setCatID(){
    if(this.cN.tit.length == 0){
      this.cN.id = "";
    }else{
      this.cN.id = this.cN.tit.toLowerCase().split(" ").join("_")
    }
  }

  invalidTit(tit:string){
    const newKey  = new FormControl(tit, [
      Validators.pattern('^[0-9A-Za-z ]+$')
    ]);
    return newKey.invalid;
  }

  createCat(){
    this.makingChanges = true;
    if( !this.cN.tit ||  !this.cN.id || !this.cN.img ){
      this.makingChanges = false;
      this.auth.resource.startSnackBar("Set proper Image, Url & Catagory Name")
    }else{
      if(this.cat.findIndex((a:any) => a.tit.toLowerCase() == this.cN.tit.toLowerCase()) !== -1){
        this.makingChanges = false;
        this.auth.resource.startSnackBar("Such catagory already exist")
      }else{
        if(this.invalidTit(this.cN.tit)){
          this.makingChanges = false;
          this.auth.resource.startSnackBar("You can only use 0-9A-Za-z ")
        }else{
        this.master.createBurnCat(this.cN.id, this.cN.tit, this.cN.img).then(() => {
          this.makingChanges = false;
          this.createNew = false;
          this.cN.id = ""; 
          this.cN.tit = "";
          this.cN.img = "";
          this.auth.resource.startSnackBar("Burn catagory created");
        })
        }
      }
    }
  }

  updateCat(){
    this.makingChanges = true;
    if( !this.cU.tit ||  !this.cU.id || !this.cU.img ){
      this.makingChanges = false;
      this.auth.resource.startSnackBar("Something not right.")
    }else{
      this.master.updateBurnCat(this.cU.id, this.cU).then(() => {
        this.makingChanges = false;
        this.createNew = false;
        this.auth.resource.startSnackBar("Burn catagory updated");
      })
    }
  }

  async takePicture(what:string){
    const type = ((
      what == "cN-Logo" || what == "cU-Logo"  || what == "cU-Spotlight"
    ) ? "logo" : "") + ((
      what == "cU-Banner" || what == "cU-NewIN"
    ) ? "banner" : "");

    if(!this.makingChanges){
      const image = await Camera.getPhoto({
        quality: 100,
        height: 300,
        width: 300,
        allowEditing: false,
        //source:CameraSource.Camera,
        resultType: CameraResultType.Uri
      });
      console.log("image", image)
      const imageUrl = image.webPath || "";
      if(imageUrl){
      this.startCropper(imageUrl, type, what);
      console.log("image", imageUrl)
      }else{
        console.log("No image")
      }
    }
  }

  startCropper(webPath:string, type:string, what:string){
    if(!this.makingChanges){
      let isPhone = this.auth.resource.getWidth < 768;
      let w = isPhone ? this.auth.resource.getWidth + "px" : "480px";
      let h = isPhone ? this.auth.resource.getHeight + "px" : "";
      const refDialog = this.auth.resource.dialog.open(CropperComponent, {
        width: w, minWidth: "320px", maxWidth: "480px",
        height:h,
        data:{webPath:webPath, type:type},
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


          if(what == "cN-Logo"){
            this.cN.img = result.croppedImage;
            this.auth.resource.startSnackBar("Catagory Logo selected!");
            this.makingChanges = false;
          }

          if(
            what == "cU-Logo" || 
            what == "cU-Banner" || what == "cU-NewIN" || what == "cU-Spotlight" 
          ){
            const id = (what == "cU-Logo" ? "":"") +  (what == "cU-Banner" ? "":"") + (what == "cU-NewIN" ? "":"") + (what == "cU-Spotlight" ? "":"");
            this.setUpUpdate(what, id, result.croppedImage)
          }


        }
      })
    }
  }

  async setUpUpdate(what:string, id:string, croppedImage:string){
    const cloudUpload = await this.master.cloudUploadBurn(id, croppedImage);
    if(!cloudUpload.success){
      this.auth.resource.startSnackBar("There was an issue uploading.")
    }else{
        const u = cloudUpload.url;

      if( what == "cU-Logo" ){
        this.cU.img = u;
      }

      if( what == "cU-Banner" ){
        const x = {url:"", img:u}
        this.cU.banners.push(x);
        this.bannerX = x;
      }

      if( what == "cU-NewIN" ){
        const x = {url:"", img:u}
        this.cU.newIN.push(x);
        this.newINX = x;
      }

      if( what == "cU-Spotlight" ){
        const x = {url:"", img:u}
        this.cU.spot.push(x);
        this.spotX = x;
      }


    }
  }

  removeBanner(what:string, img:string){
    console.log(what, img)
    if( what == "cU-Banner" ){
      const x = this.cU.banners.findIndex((v:any) => v.img == img)
      this.cU.banners.splice(x, 1);
      console.log("cU-Banner", x)
      if(this.cU.banners.length > 0){
        this.bannerX = this.cU.banners[0];
      }else{
        this.bannerX = {url:"", img:""}
      }
    }
    if( what == "cU-NewIN" ){
      const x = this.cU.newIN.findIndex((v:any) => v.img == img)
      this.cU.newIN.splice(x, 1);
      console.log("cU-NewIN", x)
      if(this.cU.newIN.length > 0){
        this.newINX = this.cU.newIN[0];
      }else{
        this.newINX = {url:"", img:""}
      }
    }
    if( what == "cU-Spotlight" ){
      const x = this.cU.spot.findIndex((v:any) => v.img == img)
      this.cU.spot.splice(x, 1);
      console.log("cU-Spotlight", x)
      if(this.cU.spot.length > 0){
        this.spotX = this.cU.spot[0];
      }else{
        this.spotX = {url:"", img:""}
      }
    }
  }

}

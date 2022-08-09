import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormControl } from '@angular/forms';
import { Observable, of, take } from 'rxjs';
import { CropperComponent } from 'src/app/placeholders/cropper/cropper.component';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master.service';

import QRCodeStyling, { Extension } from 'qr-code-styling';
import { ActivatedRoute } from '@angular/router';
import { AddBalanceVendorComponent } from './add-balance-vendor/add-balance-vendor.component';
import { User } from 'firebase/auth';
import { PayComponent } from 'src/app/components/pay/pay.component';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  activeLink:string = "Manage Store";
  
  storeID = "";
  storeType = "";
  userData:User | undefined;
  storeName = "";
  storeLogo = "";
  storeBanner = "";
  storeBannersActive = "";
  storeBannersList: string[] = [];
  store$: Observable<any> = of();
  //user$: Observable<any> = of();
  dataCurrent:any;
  typeORDER:any = null;
  listLoc:any[] = [];
  makingChanges = true;

  storeLoc:any = {
    opensDaily: true, opensDailyS:"07:00", opensDailyE:"23:00",
    openMon: true, openMonS:"07:00", openMonE:"23:00",
    openTue: true, openTueS:"07:00", openTueE:"23:00",
    openWed: true, openWedS:"07:00", openWedE:"23:00",
    openThu: true, openThuS:"07:00", openThuE:"23:00",
    openFri: true, openFriS:"07:00", openFriE:"23:00",
    openSat: true, openSatS:"07:00", openSatE:"23:00",
    openSun: false, openSunS:"07:00", openSunE:"23:00",
    delivery: "Citywide", logistics:false, 
    exchange: true, 
    return: true, 
    refund: true, 
    phoneHide: true, 
    COD: true,

    storeCat:"",
    storeSubCat:""
  }
  disableLoc = true;
  imageLOADED: string[] = [];
  viewPrimeUser = false;

  qrCodePOS:any = null;
  qrCodeInvoice:any = null;
  qrCodeSubs:any = null;

  showCode1 = false;
  showCode2 = false;
  showCode3 = false;
  
  @ViewChild('canvasX1', { static: false }) canvasX1: ElementRef | undefined;
  @ViewChild('canvasX2', { static: false }) canvasX2: ElementRef | undefined;
  @ViewChild('canvasX3', { static: false }) canvasX3: ElementRef | undefined;

  constructor(
    public auth: AuthService,
    private master: MasterService ,
    private actRoute: ActivatedRoute
    ) { 
      this.execute()
    }

  ngOnInit(): void {
  }

  execute(){

    const storeID = this.actRoute.snapshot.params["id"];
    if(!storeID){

    }else{

    this.master.getStoreByID(storeID).then(storeRef => {
     const store:any = storeRef.exists() ? storeRef.data() : null;
      if(!store){

      }else{
        //this.store$ = of(store)
        this.storeID = store["id"];
        this.storeType = store["type"];
        this.storeName = store["name"];
        this.storeLogo = store["logo"];
        this.storeBanner = store["banner"];

        if(store.banner.length > 0){
          this.storeBannersList = store.banners;
          this.storeBannersActive = store.banners[0];
        }
        
        this.listLoc = store.loc;
        const xLoc = store.schedule;
        
        xLoc["delivery"] = store.typeORDER.delivery; xLoc["logistics"] = store.typeORDER.logistics;
        xLoc["exchange"] = store.typeORDER.exchange; xLoc["refund"] = store.typeORDER.refund; xLoc["return"] = store.typeORDER.return;
        
        xLoc["phoneHide"] = store.typeORDER.phoneHide || false;

        xLoc["COD"] = store.typeORDER.COD;
        xLoc["storeType"] = store.type;
        xLoc["storeCat"] = store.cat;
        xLoc["storeSubCat"] = store.subCat;

        this.storeLoc = xLoc;
        this.typeORDER = store.typeORDER;

        this.master.getUserByUID(store["by"]).then(userRef => {
          const user:any = userRef.exists() ? userRef.data() : null;
          if(!user){

          }else{
            //this.store$ = of(store)
            //this.user$ = of(user)
            const storeX = store;
            storeX["userINFO"] = user;
            this.store$ = of(storeX);
            this.auth.resource.first.setValue( user.name );
            this.auth.resource.last.setValue( store.name );

            const data = {
              //false, user.username, 
              name: user.name || "", 
              soIG:user.soIG, soYT:user.soYT, soTW:user.soTW, soWA:user.soWA,
              //user.info, user.url, user.typ, user.sex, user.stat, user.check, 
              uid: user.uid, iso: user.iso || "",
              phoneNumFull: user.phone.split("+91")[1] || ""
            }
            this.dataCurrent = data;
            this.userData = user;
            this.makingChanges = false;

            console.log("storeX", storeX)
            const v1 = store.shareUrlV1 || "";
            const b1 = store.shareUrlB1 || "";
            const x1 = store.shareUrlX1 || "";

            if(store.addedDynamicLink){
            this.setQR(v1, b1, x1)
            }
          }
        })
      }
    })
    }

  }

  updateName(uid:string){
    this.makingChanges = true;
    this.auth.resource.first.disable();
    if( this.auth.resource.first.invalid 
      ){
      this.auth.resource.first.enable();
      this.makingChanges = false;
      this.auth.resource.startSnackBar("issue: format must be A-Za-z.")
    }else{
      
      const newName = this.auth.resource.first.value; //+ (this.auth.resource.last.value ? (" " + this.auth.resource.last.value) : "");
      console.log(this.dataCurrent.name, newName)

      this.master.updateUserBio(
        uid, this.dataCurrent.name, newName,
        this.dataCurrent.soIG, this.dataCurrent.soYT,this.dataCurrent.soTW,this.dataCurrent.soWA,
        //this.dataCurrent.username, this.dataCurrent.info, this.dataCurrent.url, this.dataCurrent.typ, this.dataCurrent.sex, this.dataCurrent.stat 
        ).then(() => {
          this.dataCurrent.name = newName;
        this.auth.resource.startSnackBar("Name Updated!");
        this.auth.resource.first.enable();
        this.makingChanges = false;
      });

    }
  }

  updateStoreEmail(uid:string){}
  
  updateStoreName(uid:string){
    this.makingChanges = true;
    this.auth.resource.last.disable();
    if( this.auth.resource.last.invalid 
      ){
      this.auth.resource.last.enable();
      this.makingChanges = false;
      this.auth.resource.startSnackBar("issue: format must be A-Za-z.")
    }else{
      
      const newName = this.auth.resource.last.value; //+ (this.auth.resource.last.value ? (" " + this.auth.resource.last.value) : "");
      console.log(this.storeName, newName)

      this.master.updateStoreBio(this.storeID,
        //uid, 
        this.storeName, newName,
        //this.dataCurrent.soIG, this.dataCurrent.soYT,this.dataCurrent.soTW,this.dataCurrent.soWA,
        //this.dataCurrent.username, this.dataCurrent.info, this.dataCurrent.url, this.dataCurrent.typ, this.dataCurrent.sex, this.dataCurrent.stat 
        ).then(() => {
          this.storeName = newName;
        this.auth.resource.startSnackBar("Name Update Under Review!");
        this.auth.resource.last.enable();
        this.makingChanges = false;
      });

    }
  }

  removeStoreBanner( resultImage:string ){
    this.makingChanges = true;
    this.master.removeStoreBanners(this.storeID, resultImage ).then(() => {
      this.storeBanner = resultImage;
      const ind = this.storeBannersList.indexOf(resultImage);
      this.storeBannersList.splice( ind, 1 );
      if(this.storeBannersList.length > 0){
        this.storeBannersActive = this.storeBannersList[0];
      }else{
        this.storeBannersActive = "";
      }
      this.auth.resource.startSnackBar("Banner updated.");
      this.makingChanges = false;
      //this.auth.resource.last.enable();
    });
  }


  async takePicture(type:string){
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
      this.startCropper(imageUrl, type);
      console.log("image", imageUrl)
      }else{
        console.log("No image")
      }
    }
  }

  startCropper(webPath:string, type:string){
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

          if(type == "logo"){
            this.master.updateStoreLogo(this.storeID, result.croppedImage ).then(ref => {
              if(!ref || !ref.success){
                this.auth.resource.startSnackBar("Upload Failed!");
                this.makingChanges = false;
              }else{
                this.storeLogo = ref.url;
                this.auth.resource.startSnackBar("Logo Update Under Review!");
                this.makingChanges = false;
              }
            });
          }

          if(type == "banner"){
            this.master.updateStoreBanner(this.storeID, result.croppedImage ).then(ref => {
              if(!ref || !ref.success){
                this.auth.resource.startSnackBar("Upload Failed!");
                this.makingChanges = false;
              }else{
                this.storeBanner = ref.url;
                this.auth.resource.startSnackBar("Banner Update Under Review!");
                this.makingChanges = false;
              }
            });
          }

          if(type == "banners"){
            this.master.addStoreBanners(this.storeID, result.croppedImage ).then(ref => {
              if(!ref || !ref.success){
                this.auth.resource.startSnackBar("Upload Failed!");
                this.makingChanges = false;
              }else{
                this.storeBannersList.push(ref.url)
                if(this.storeBannersList.length == 1){
                  this.storeBannersActive = this.storeBannersList[0];
                }
                this.auth.resource.startSnackBar("Store Pics Update Under Review!");
                this.makingChanges = false;
              }
            });
          }

        }
      })
    }
  }


  onloadIMG( url:string ){
    this.imageLOADED.push(url);
  }

  updateOrdr(type:string, current:any, val:any){
    this.makingChanges = true;
    this.typeORDER[type] = val;

    this.master.updateStoreOrdr(this.storeID, this.typeORDER).then(() => {

    if(type == 'delivery'){
    this.storeLoc.delivery = val;
    }
    if(type == 'logistics'){
    this.storeLoc.logistics = val;
    }

    if(type == 'exchange'){
    this.storeLoc.exchange = val;
    }
    if(type == 'refund'){
    this.storeLoc.refund = val;
    }
    if(type == 'phoneHide'){
    this.storeLoc.phoneHide = val;
    }
    if(type == 'return'){
    this.storeLoc.return = val;
    }

    if(type == 'COD'){
    this.storeLoc.COD = val;
    }

    this.makingChanges = false;
    }).catch(err => {
    this.makingChanges = false;
    this.typeORDER[type] = current;
    this.auth.resource.startSnackBar("Issue: " + err)
    })



    // const xLoc = store.schedule;
    // xLoc["delivery"] = store.typeORDER.delivery; xLoc["logistics"] = store.typeORDER.logistics;
    // xLoc["exchange"] = store.typeORDER.exchange; xLoc["refund"] = store.typeORDER.refund; xLoc["return"] = store.typeORDER.return;
    // xLoc["COD"] = store.typeORDER.COD;
  }

  changeCatData(cat:string, subCat:string){
    this.makingChanges = true;
    if(!cat || !subCat){
      this.makingChanges = false;
    }else{
      this.master.changeCatData(this.storeID, cat, subCat).then(() => {
        this.makingChanges = false;
      }).catch(err => {
        this.makingChanges = false;
        this.auth.resource.startSnackBar("Issue: " + err)
        })
    }
  }

  updateTiming(){
    this.makingChanges = true;
    const data = {
      opensDaily: this.storeLoc.opensDaily, opensDailyS:this.storeLoc.opensDailyS, opensDailyE:this.storeLoc.opensDailyE,
      openMon: this.storeLoc.openMon, openMonS:this.storeLoc.openMonS, openMonE:this.storeLoc.openMonE,
      openTue: this.storeLoc.openTue, openTueS:this.storeLoc.openTueS, openTueE:this.storeLoc.openTueE,
      openWed: this.storeLoc.openWed, openWedS:this.storeLoc.openWedS, openWedE:this.storeLoc.openWedE,
      openThu: this.storeLoc.openThu, openThuS:this.storeLoc.openThuS, openThuE:this.storeLoc.openThuE,
      openFri: this.storeLoc.openFri, openFriS:this.storeLoc.openFriS, openFriE:this.storeLoc.openFriE,
      openSat: this.storeLoc.openSat, openSatS:this.storeLoc.openSatS, openSatE:this.storeLoc.openSatE,
      openSun: this.storeLoc.openSun, openSunS:this.storeLoc.openSunS, openSunE:this.storeLoc.openSunE,
    }

    this.master.changeTimeData(this.storeID, data).then(() => {
      this.makingChanges = false;
    }).catch(err => {
      this.makingChanges = false;
      this.auth.resource.startSnackBar("Issue: " + err)
      })

  }

  setQR(v1:string, b1:string, x1:string){

    if(v1){
    this.qrCodePOS = new QRCodeStyling({
      width: 248,
      height: 248,
      type: 'svg',
      data: v1,
      image:"assets/other/locate.svg",
      //image: 'https://firebasestorage.googleapis.com/v0/b/refr/o/locate.svg?alt=media&token=e23de5bd-4a26-4a9e-bb63-bc9e3a87b29c',
      margin: 0,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'Q'
      },
      // imageOptions: {
      //   hideBackgroundDots: false,
      //   imageSize: .8,
      //   margin: 0,
      //   crossOrigin: 'anonymous',
      // },
      dotsOptions: {
        color: '#000000',
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 0,
        //   colorStops: [{ offset: 0, color: '#8688B2' }, { offset: 1, color: '#77779C' }]
        // },
        type: 'dots'
      },
      backgroundOptions: {
        color: "rgba(255, 255, 255, 0%)",
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 0,
        //   colorStops: [{ offset: 0, color: '#ededff' }, { offset: 1, color: '#e6e7ff' }]
        // },
      },
      cornersSquareOptions: {
        color: '#512da8',
        type: 'square',
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 180,
        //   colorStops: [{ offset: 0, color: '#25456e' }, { offset: 1, color: '#4267b2' }]
        // },
      },
      cornersDotOptions: {
        color: '#000000',
        type: 'square',
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 180,
        //   colorStops: [{ offset: 0, color: '#00266e' }, { offset: 1, color: '#4060b3' }]
        // },
      }
    });
    setTimeout(() => {
      this.qrCodePOS.append(this.canvasX1?.nativeElement);
      this.showCode1 = true;
    }, 3000)
    }

    if(b1){
    this.qrCodeInvoice = new QRCodeStyling({
      width: 248,
      height: 248,
      type: 'svg',
      data: b1,
      image: 'https://firebasestorage.googleapis.com/v0/b/refr/o/locate.svg?alt=media&token=e23de5bd-4a26-4a9e-bb63-bc9e3a87b29c',
      margin: 0,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'Q'
      },
      // imageOptions: {
      //   hideBackgroundDots: false,
      //   imageSize: .8,
      //   margin: 0,
      //   crossOrigin: 'anonymous',
      // },
      dotsOptions: {
        color: '#000000',
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 0,
        //   colorStops: [{ offset: 0, color: '#8688B2' }, { offset: 1, color: '#77779C' }]
        // },
        type: 'dots'
      },
      backgroundOptions: {
        color: "rgba(255, 255, 255, 0%)",
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 0,
        //   colorStops: [{ offset: 0, color: '#ededff' }, { offset: 1, color: '#e6e7ff' }]
        // },
      },
      cornersSquareOptions: {
        color: '#512da8',
        type: 'square',
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 180,
        //   colorStops: [{ offset: 0, color: '#25456e' }, { offset: 1, color: '#4267b2' }]
        // },
      },
      cornersDotOptions: {
        color: '#000000',
        type: 'square',
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 180,
        //   colorStops: [{ offset: 0, color: '#00266e' }, { offset: 1, color: '#4060b3' }]
        // },
      }
    });
    setTimeout(() => {
      this.qrCodeInvoice.append(this.canvasX2?.nativeElement);
      this.showCode2 = true;
    }, 3000)
    }

    if(x1){
    this.qrCodeSubs = new QRCodeStyling({
      width: 248,
      height: 248,
      type: 'svg',
      data: x1,
      image: 'https://firebasestorage.googleapis.com/v0/b/refr/o/locate.svg?alt=media&token=e23de5bd-4a26-4a9e-bb63-bc9e3a87b29c',
      margin: 0,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'Q'
      },
      // imageOptions: {
      //   hideBackgroundDots: false,
      //   imageSize: .8,
      //   margin: 0,
      //   crossOrigin: 'anonymous',
      // },
      dotsOptions: {
        color: '#000000',
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 0,
        //   colorStops: [{ offset: 0, color: '#8688B2' }, { offset: 1, color: '#77779C' }]
        // },
        type: 'dots'
      },
      backgroundOptions: {
        color: "rgba(255, 255, 255, 0%)",
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 0,
        //   colorStops: [{ offset: 0, color: '#ededff' }, { offset: 1, color: '#e6e7ff' }]
        // },
      },
      cornersSquareOptions: {
        color: '#512da8',
        type: 'square',
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 180,
        //   colorStops: [{ offset: 0, color: '#25456e' }, { offset: 1, color: '#4267b2' }]
        // },
      },
      cornersDotOptions: {
        color: '#000000',
        type: 'square',
        // gradient: {
        //   type: 'linear', // 'radial'
        //   rotation: 180,
        //   colorStops: [{ offset: 0, color: '#00266e' }, { offset: 1, color: '#4060b3' }]
        // },
      }
    });

    setTimeout(() => {
    this.showCode3 = true;
      
      this.qrCodeSubs.append(this.canvasX3?.nativeElement);
    }, 3000)

    }



    setTimeout(() => {
      console.log("Done")
      //const type:string[] = [];
      //this.payments$ = this.pay.getAllPayments(mine.uid, 22, type).pipe(take(1));
    }, 3000)
  }



  downloadPOS(extension:string, id:string, name:string) {
    if(extension){
      //this.qrCodePOS.download({ extension: extension as Extension });
      try{
        this.qrCodePOS.download(
          { name: "store-" + name.split(" ").join("_").toLowerCase() + "-POS", extension: "png" as Extension }
        ) ;
      }catch(err){
        console.log(err)
      }
    }
  }

  downloadInvoice(extension:string): void {
    if(extension){
      this.qrCodeInvoice.download({ extension: extension as Extension });
    }
  }

  downloadSubs(extension:string): void {
    if(extension){
      this.qrCodeSubs.download({ extension: extension as Extension });
    }
  }

  editFunds(admin: string, name: string){
    let w = this.auth.resource.getWidth + 'px';
    //let h = this.auth.resource.getHeight + 'px';
    const refDialog = this.auth.resource.dialog.open(AddBalanceVendorComponent, {
      width: w, minWidth: "320px", maxWidth: "480px",
      //height:h,

      data:{what:"addMoney", admin, name },
      disableClose: true, 
      panelClass:"dialogLayout"//, autoFocus:false
    });
    refDialog.afterClosed().subscribe(r => {
      if(!r.success){

      }else{
        if(this.userData){
        const payX = {
          cut: r.pay.cut, refill: r.pay.refill, cutRate: r.pay.cutRate, pay:r.pay.payX
        }
        console.log("payX", payX)

        //const amRate = this.auth.resource.campaignPlans;
        const amRate = payX;
        //const amCamp = payX;
        //const amMerc = this.getMerchCost() || 0;
        const amSale = 0//(this.campCost(tX) + ( (oferOFF ? this.oferCost(oferOFF):0) + ( oferONL ? this.oferCost(oferONL):0) ));
        const amCost = payX.pay;//100;//payX;
        const amSave = 0;//(oferOFF ? this.oferCost(oferOFF):0) + ( oferONL ? this.oferCost(oferONL):0);
        const amTotal = payX.pay;

        const amPaid = payX.pay;
        const amGive = payX.refill;

        this.startCampaignPaymentCustom( 
          admin, name,
          this.userData.uid, //ref.tX, 
          amRate, //amCamp, 
          //amMerc, 
          amSale,amCost,amSave,amTotal,
          amPaid, amGive
          //this.userData.uid, //ref.storeCamp
        );
        }
      }
    })
  }

  ProvideFunds(){ // 500RS CREDIT

  }

  startCampaignPaymentCustom(
    admin: string, name: string, 
    by:string, //tX:string, 
    amRate:any, //amCamp:number, 
    //amMerc:number, 
    amSale:number, amCost:number, amSave:number, 
    amTotal:number ,
    amPaid:number, amGive:number
  ){
    let w = this.auth.resource.getWidth + "px";
    let h = this.auth.resource.getHeight + "px";

    const refDialog = this.auth.resource.dialog.open(PayComponent, {
      width: w, minWidth: w, maxWidth: w,
      height: h, 
      data:{ 
        //campID: this.userData.campID,
        from:"CAMP_ADMIN", //tX:tX,
        type:["addBalance", "nextBalance", "vendorAc"], by, to:"Δ", 
        amRate, //amCamp, 
        //amMerc, 
        amSale, amCost, amSave, 
        amTotal, 

        userData:this.userData,
        admin, name,
        amPaid, amGive
      },
      
      disableClose: true, panelClass:"dialogLayout"//, autoFocus:false
    });
    
    refDialog.afterClosed().subscribe(ref =>{
      if(!ref.success){
        console.log(ref)
        this.auth.resource.startSnackBar(ref.info)
        //this.disableForm = false;
      }else{
        console.log("Payment Complete")
        this.auth.resource.startSnackBar("Payment Complete")
      }
    })
  }

}

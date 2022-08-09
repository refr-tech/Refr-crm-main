import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { User } from 'firebase/auth';
import { Observable, of, take } from 'rxjs';
import { PayComponent } from 'src/app/components/pay/pay.component';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master.service';
import { AddBalanceClientComponent } from './add-balance-client/add-balance-client.component';


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements  OnInit, AfterViewInit {

  user$: Observable<any> = of();

  makingChanges = true;
  userData:User | undefined;

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


  execute(){

    //const UID = "NVvOyAVjGHUPjDf6RP6ZMuOcson2";
    const UID = this.actRoute.snapshot.params["uid"];
    if(!UID){

    }else{
      this.master.getUserByUID(UID).then(userRef => {
        const user:any = userRef.exists() ? userRef.data() : null;
        if(!user){
  
        }else{
          this.user$ = of(user);
          this.userData = user;
          this.makingChanges = false;
        }
      })
      
    }
  }



  editFunds(admin: string, name: string){
    let w = this.auth.resource.getWidth + 'px';
    //let h = this.auth.resource.getHeight + 'px';
    const refDialog = this.auth.resource.dialog.open(AddBalanceClientComponent, {
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
        from:"RCASH_ADMIN", //tX:tX,
        type:["addBalance", "nextBalance", "clientAc"], by, to:"Δ", 
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


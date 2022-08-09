import { Component, Inject, OnInit } from '@angular/core';

import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-balance-client',
  templateUrl: './add-balance-client.component.html',
  styleUrls: ['./add-balance-client.component.scss']
})
export class AddBalanceClientComponent implements OnInit {

  makingChanges = false;
  payPaid:any|number|undefined = undefined;
  payGive:any|number|undefined = undefined;
  adminName:string = "";
  refrCut = 10; // 10% of any value
  Agree = false;

  constructor(
    public auth: AuthService,
    private dialogRef: MatDialogRef<AddBalanceClientComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if(data.what == "addMoney"){
      this.adminName = data.name;
    }
   }

  ngOnInit(): void {
  }

  choosePay(amt:number){
    this.payGive = amt;
  }

  getCut(payX:number){
    if( payX && payX > 99){
      const p = payX - ( payX * this.refrCut / 100 );
      this.payGive = p;
    }else{
      const p = undefined;
      this.payGive = p;
    }
  }

  getCutRate(){
    if(!this.payGive || !this.payPaid){
      return undefined;
    }else{
      const p = this.payGive / this.payPaid * 100;
      //(this.payPaid - ( this.payPaid * this.refrCut / 100 ))/this.payGive;
      return 100 - p;
    }
  }

  startPay(){
      this.makingChanges = true;

    if( !this.payPaid || this.payPaid < 100 || this.invalidAMT(this.payPaid) || !this.payGive || this.payPaid < this.payGive || this.invalidAMT(this.payGive) ){
      if(!this.payPaid || this.payPaid < 100 || this.invalidAMT(this.payPaid)){
        this.auth.resource.startSnackBar("Paid Amount must be higher than ₹99")

      }else{
        if( !this.payGive || this.payPaid < this.payGive || this.invalidAMT(this.payGive) ){
          this.auth.resource.startSnackBar("Give Amount must be lower or equal to Paid")
        }else{
          this.auth.resource.startSnackBar("Invalid Fields!")
        }
      }
      this.makingChanges = false;
    }else{
      const cut = this.payGive - this.payPaid;//this.getCut() || 0;
      const payX = this.payGive;
      const refill = this.payGive;

      this.dialogRef.close({success:true,
        pay:{ payX:payX,  cut:cut, refill:refill, cutRate: this.getCutRate() }
        //amt:this.payX, rate:{ cut:cut, refill:refill, cutRate: this.refrCut } 
      });
    }

  }

  invalidAMT(amt:number){
    const newNum  = new FormControl(amt, [
      Validators.pattern('^[0-9]+$')
    ]);
    return newNum.invalid;
  }

}

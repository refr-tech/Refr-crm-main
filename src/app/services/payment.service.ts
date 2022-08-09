import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, doc, Firestore, limit, orderBy, query, updateDoc, where, FieldValue, increment, serverTimestamp } from '@angular/fire/firestore';
//import { AngularFireAuth } from '@angular/fire/compat/auth';
//import { AngularFirestore } from '@angular/fire/compat/firestore';

//import app from 'firebase/compat/app';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../universal.model';
import { ResourceService } from './resource.service';

/*
name	uppercase	lowercase
alpha	Α	α
beta	Β	β
gamma	Γ	γ
delta	Δ	δ - SENT 2 THE COMPANY
epsilon	Ε	ε
zeta	Ζ	ζ
eta	Η	η
theta	Θ	θ
iota	Ι	ι
kappa	Κ	κ
lambda	Λ	λ
mu	Μ	μ
nu	Ν	ν
xi	Ξ	ξ
omicron	Ο	ο
pi	Π	π
rho	Ρ	ρ
sigma	Σ	σ
tau	Τ	τ
upsilon	Υ	υ
phi	Φ	φ
chi	Χ	χ
psi	Ψ	ψ
omega	Ω	ω
*/


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  gWay:string = "walt";

  razorpayOptions = {}

  constructor(
    private httpClient: HttpClient,
    //public afAuth: AngularFireAuth,
    public afAuth: Auth,
    //private afs: AngularFirestore,
    private firestore: Firestore,
    public resource: ResourceService
  ) { }

  get getServerTimestamp(){ return serverTimestamp; }

  records(ac:string, amt:number){
    if(
      ac == "client" ||
      ac == "gateway" ||
      ac == "given" || // by admin
      ac == "refr" ||
      ac == "taken" ||
      ac == "takenClient" ||
      ac == "takenVendor" ||
      ac == "taxes" ||
      ac == "vendor" 
    ){
    const gWayRef = doc(this.firestore,`access`, `accounts`);
      
    return updateDoc(gWayRef, {ac: increment(amt)})
    }else{
      this.resource.startSnackBar("No such account.")
    }
  }

  startGatewaySign(data:any){
    const newTimestamp = this.getServerTimestamp();
    const dataSend:any = { 
      type:["addBalance", "firstBalance", "vendorAc", data.by], 
      by:data.by, to:"Δ", 
      amRate:data.amRate, amCamp:data.amCamp, amMerc:data.amMerc, amSale:data.amSale, amCost:data.amCost, amSave:data.amSave, 
      amTotal:data.amTotal,
      sin: newTimestamp, upd: newTimestamp, com: newTimestamp
    }
    console.log("dataSend",dataSend);
    const gWayRefC = collection(this.firestore, `${this.gWay}`);
    return addDoc(gWayRefC, dataSend).then(ref => {
      const gWayRef = doc(this.firestore,`${this.gWay}`, `${ref.id}`)
      return updateDoc(gWayRef, {id:ref.id}).then(() => {return ref;})
    })
  }

  startGatewayCamp(data:any){
    const newTimestamp = this.getServerTimestamp();
    const dataSend:any = { 
      type:["addBalance", "campaignBalance", "vendorAc", data.by], 
      by:data.by, to:"Δ", 
      amRate:data.amRate, amCamp:data.amCamp, 
      //amMerc:data.amMerc, 
      amSale:data.amSale, amCost:data.amCost, amSave:data.amSave, 
      amTotal:data.amTotal,
      sin: newTimestamp, upd: newTimestamp, com: newTimestamp
    }
    console.log("dataSend",dataSend);
    const gWayRefC = collection(this.firestore,`${this.gWay}`);
    return addDoc(gWayRefC, dataSend).then(ref => {
      const gWayRef = doc(this.firestore,`${this.gWay}`, `${ref.id}`)
      return updateDoc(gWayRef, {id:ref.id}).then(() => {return ref;})
    })
  }

  startAdminGatewayCamp(data:any){
    const newTimestamp = this.getServerTimestamp();
    const dataSend:any = { 
      type:["addBalance", "campaignBalance", "vendorAc", data.by, data.name, data.admin,  "admin"], 
      by:data.by, to:"Δ", 
      amRate:data.amRate, //amCamp:data.amCamp, 
      amPaid:data.amPaid, amGive:data.amGive, via:{by:data.admin, name: data.name},
      //amMerc:data.amMerc, 
      amSale:data.amSale, amCost:data.amCost, amSave:data.amSave, 
      amTotal:data.amTotal,
      sin: newTimestamp, upd: newTimestamp, com: newTimestamp
    }
    console.log("dataSend",dataSend);
    const gWayRefC = collection(this.firestore,`${this.gWay}`);
    return addDoc(gWayRefC, dataSend).then(ref => {
      const gWayRef = doc(this.firestore,`${this.gWay}`, `${ref.id}`)
      return updateDoc(gWayRef, {id:ref.id}).then(() => {return ref;})
    })
  }

  startAdminGatewayRefrCASH(data:any){
    const newTimestamp = this.getServerTimestamp();
    const dataSend:any = { 
      type:["addBalance", "campaignBalance", "clientAc", data.by, data.name, data.admin, "Δ", "admin"], 
      by:data.by, to:"Δ", journey:"ADMIN",
      amRate:data.amRate, //amCamp:data.amCamp, 
      amPaid:data.amPaid, amGive:data.amGive, via:{by:data.admin, name: data.name},
      //amMerc:data.amMerc, 
      amSale:data.amSale, amCost:data.amCost, amSave:data.amSave, 
      amTotal:data.amTotal,
      sin: newTimestamp, upd: newTimestamp, com: newTimestamp
    }
    console.log("dataSend",dataSend);
    const gWayRefC = collection(this.firestore,`${this.gWay}`);
    return addDoc(gWayRefC, dataSend).then(ref => {
      const gWayRef = doc(this.firestore,`${this.gWay}`, `${ref.id}`)
      return updateDoc(gWayRef, {id:ref.id}).then(() => {return ref;})
    })
  }
  
  startGatewayWallet(data:any){
    const newTimestamp = this.getServerTimestamp();
    const dataSend:any = { 
      type:["addBalance", "walletBalance", "vendorAc", data.by], 
      by:data.by, to:"Δ", 
      //amRate:data.amRate, // amCamp:data.amCamp, 
      //amMerc:data.amMerc, 
      amSale:data.amSale, amCost:data.amCost, amSave:data.amSave, 
      amTotal:data.amTotal,
      sin: newTimestamp, upd: newTimestamp, com: newTimestamp
    }
    console.log("dataSend",dataSend);
    const gWayRefC = collection(this.firestore,`${this.gWay}`);
    return addDoc(gWayRefC, dataSend).then(ref => {
      const gWayRef = doc(this.firestore,`${this.gWay}`, `${ref.id}`)
      return updateDoc(gWayRef, {id:ref.id}).then(() => {return ref;})
    })
  }



  onlinePaymentNew(iso:string, obj:any){
    //return this.http.post<any>(`${environment.baseURL}/payment/initPaymentNew`, obj)
    const body = {
      type:"razorpay",
      gwID:"",
      amount:obj.amount, currency:obj.currency,
      amount_paid:obj.amount_paid,
      amount_due:obj.amount_due,
      receipt:obj.orderId,

      name: obj.name,
      description: obj.description,
      userData: obj.userData,
      theme: obj.theme,
      status:0
    }
    console.log("send payment")
    return this.httpClient.post(`${environment.server}/api/payments/sendPayment/${ iso }`, body);
  }

  verifyPayment(iso:string, obj:any){
    //return this.http.post<any>(`${environment.baseURL}/payment/initPaymentNew`, obj)
    const body = {
      type:"razorpay",
      amount:obj.amount, currency:obj.currency,
      gwID:obj.paymentId, gwSIGN:obj.signature, gwORDR:obj.order_id,
    }
    console.log("verify payment")
    return this.httpClient.post(`${environment.server}/api/payments/verifyPayment/${ iso }`, body);
  }

  addVendorBalance(id:string, uid:string, amt: number, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any){
    const gWayRefC = doc(this.firestore,`${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(gWayRefC, {acBalV:amt}).then(() => {
      return this.completePayment(id, gwID, gwSIGN, gwORDR,gwInfo);
    });
  }
  addVendorReserve(id:string, uid:string, amt: number, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalVr:amt}).then(() => {
      return this.completePayment(id, gwID, gwSIGN, gwORDR,gwInfo);
    });
  }
  addVendorHypeBalance(id:string, uid:string, amt: number, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, { acBalH: increment(amt) }).then(() => {
      return this.completePayment(id, gwID, gwSIGN, gwORDR, gwInfo);
    });
  }
  addVendorHypeBalanceADMIN(id:string, uid:string, amt: number, adminUID:string, adminName:string
    //, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any
    ){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, { acBalH: increment(amt),  acBalGivenV: increment(amt) }).then(() => {
      return this.completePaymentCampADMIN(id //, gwID, gwSIGN, gwORDR, gwInfo
        );
    });
  }
  addClientBalanceADMIN(id:string, uid:string, amt: number, adminUID:string, adminName:string
    //, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any
    ){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, { acBalC: increment(amt),  acBalGivenC: increment(amt) }).then(() => {
      return this.completePaymentRefrCashADMIN(id //, gwID, gwSIGN, gwORDR, gwInfo
        );
    });
  }

  completePaymentCampADMIN(id:string //, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any
    ){
    const userRef = doc(this.firestore, `${this.gWay}`, `${id}`);
    return updateDoc(userRef, {
      //gwID:gwID, gwSIGN, gwORDR, 
      status:10, 
      //gwInfo:gwInfo
    });
  }

  completePaymentRefrCashADMIN(id:string //, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any
    ){
    const userRef = doc(this.firestore, `${this.gWay}`, `${id}`);
    return updateDoc(userRef, {
      //gwID:gwID, gwSIGN, gwORDR, 
      status:10, 
      //gwInfo:gwInfo
    });
  }

  addClientBalance(id:string, uid:string, amt: number, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalC:amt}).then(() => {
      return this.completePayment(id, gwID, gwSIGN, gwORDR,gwInfo);
    });
  }
  addClientReserve(id:string, uid:string, amt: number, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalCr:amt}).then(() => {
      return this.completePayment(id, gwID, gwSIGN, gwORDR,gwInfo);
    });
  }
  addClientPointsBalance(id:string, uid:string, amt: number, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any){
    const userRef = doc(this.firestore, `${this.resource.env.db.users}`, `${uid}`);
    return updateDoc(userRef, {acBalP:amt}).then(() => {
      return this.completePayment(id, gwID, gwSIGN, gwORDR,gwInfo);
    });
  }

  completePayment(id:string, gwID:string, gwSIGN:string, gwORDR:string, gwInfo:any){
    const userRef = doc(this.firestore, `${this.gWay}`, `${id}`);
    return updateDoc(userRef, {gwID:gwID, gwSIGN, gwORDR, status:10, gwInfo:gwInfo});
  }

  completeHypePayment(campID:string){
    const userRef = doc(this.firestore, `${this.resource.env.db.hypes}`, `${campID}`);
    return updateDoc(userRef, {paid: true});
  }

  getAllPayments(uid:string, s:number, type:string[]){
    const catData = collection(this.firestore, `${this.gWay}`)
    const qu = query(catData, where("by","==",uid), orderBy("com", "desc"), limit(s));
    return collectionData( qu );
  }

  getAllOrders(uid:string, s:number, type:string[]){
    const catData = collection(this.firestore, `${this.gWay}`)
    const qu = query(catData, where("to","==",uid),where("type","array-contains-any",type), orderBy("com", "desc"), limit(s));
    return collectionData( qu );
  }

}

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,

  domain:"http://localhost:4200",
  //server:"",
  //server:"http://refr.club",
  server:"https://biz.refr.club",
  //server:"https://refr.club/ind_serve",
  //server:"http://localhost:5001/refr-india/us-central1/ind_serve",

  refrBot:{
    vr: 101.91, 
    web:1.91, andi: 1.91, ios: 1.91,
    env: false,
    code:"Albatrosses", date: 1644195271637
    /*
    vr: 101.0, 
    web:0.0, andi: 0.0, ios: 0.0,
    env: false,
    code:"NONE", date: Date.now()
    */
  },

  firebase:{
    apiKey: "AIzaSyDH4KRqGtrYXyIQVy2pW-C9IHihoYc1akQ",
    authDomain: "refr-india.firebaseapp.com",
    projectId: "refr-india",
    //storageBucket: "refr-india.appspot.com",
    storageBucket: "refr",
    messagingSenderId: "471641178783",
    appId: "1:471641178783:web:43c8aa09c584db065f18aa"
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

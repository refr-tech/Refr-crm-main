import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, BottomSheetUpdate } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';

import { BottomSheetNotification, TabsComponent } from './components/tabs/tabs.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ProfileComponent } from './components/tabs/profile/profile.component';
import { SignComponent } from './components/welcome/sign/sign.component';

import { PayComponent } from './components/pay/pay.component';
import { environment } from '../environments/environment';

import { provideFirebaseApp, getApp, initializeApp, FirebaseApp } from '@angular/fire/app';
import { provideAuth, initializeAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

import { indexedDBLocalPersistence, browserPopupRedirectResolver } from 'firebase/auth';

// 1. Import the libs you need
// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
// import { AngularFireStorageModule } from '@angular/fire/compat/storage';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';
// import {
//   getAuth,
//   indexedDBLocalPersistence,
//   initializeAuth,
//   provideAuth,
// } from '@angular/fire/auth';
import { ImageCropperModule } from 'ngx-image-cropper';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { GoogleMapsModule } from '@angular/google-maps';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';

import { ContentComponent } from './placeholders/content/content.component';
import { CropperComponent } from './placeholders/cropper/cropper.component';
import { DashboardComponent } from './components/tabs/dashboard/dashboard.component';
import { UsersComponent } from './components/tabs/users/users.component';
import { StoresComponent } from './components/tabs/stores/stores.component';
import { LogisticsComponent } from './components/tabs/logistics/logistics.component';
import { BurnComponent } from './components/tabs/burn/burn.component';
import { TransactionsComponent } from './components/tabs/transactions/transactions.component';
import { IntegrationsComponent } from './components/tabs/integrations/integrations.component';
import { CampaignsComponent } from './components/tabs/stores/campaigns/campaigns.component';
import { ProductsComponent } from './components/tabs/stores/products/products.component';
import { OrdersComponent } from './components/tabs/users/orders/orders.component';
import { ActivityComponent } from './components/tabs/users/activity/activity.component';
import { SpinnerComponent } from './placeholders/spinner/spinner.component';
import { StoreComponent } from './components/tabs/stores/store/store.component';
import { CampaignComponent } from './components/tabs/stores/campaigns/campaign/campaign.component';
import { ProductComponent } from './components/tabs/stores/products/product/product.component';
import { ProductSearchComponent } from './components/tabs/stores/products/product-search/product-search.component';
import { CampaignSearchComponent } from './components/tabs/stores/campaigns/campaign-search/campaign-search.component';
import { UploadProductComponent } from './components/tabs/stores/products/product-search/upload-product/upload-product.component';
import { BurnCatComponent } from './components/tabs/burn/burn-cat/burn-cat.component';
import { BurnReqComponent } from './components/tabs/burn/burn-req/burn-req.component';
import { CreateProductComponent } from './components/tabs/stores/products/create-product/create-product.component';
import { BurnListComponent } from './components/tabs/burn/burn-list/burn-list.component';
import { CreateCampaignComponent } from './components/tabs/stores/campaigns/create-campaign/create-campaign.component';
import { AddBalanceVendorComponent } from './components/tabs/stores/store/add-balance-vendor/add-balance-vendor.component';
import { AddBalanceClientComponent } from './components/tabs/users/activity/add-balance-client/add-balance-client.component';

// import { Capacitor } from '@capacitor/core';
// import { getApp } from '@firebase/app';

@NgModule({
  declarations: [
    AppComponent,
    TabsComponent, BottomSheetNotification,
    WelcomeComponent, DashboardComponent, BottomSheetUpdate,
    ProfileComponent,
    SignComponent,
    ContentComponent,
    CropperComponent,
    PayComponent,
    UsersComponent,
    StoresComponent,
    LogisticsComponent,
    BurnComponent,
    TransactionsComponent,
    IntegrationsComponent,
    CampaignsComponent,
    ProductsComponent,
    OrdersComponent,
    ActivityComponent,
    SpinnerComponent,
    StoreComponent,
    CampaignComponent,
    ProductComponent,
    ProductSearchComponent,
    CampaignSearchComponent,
    UploadProductComponent,
    BurnCatComponent,
    BurnReqComponent,
    CreateProductComponent,
    BurnListComponent,
    CreateCampaignComponent,
    AddBalanceVendorComponent,
    AddBalanceClientComponent, 
  ],
  imports: [
    BrowserModule, CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule, HttpClientJsonpModule,

    FormsModule, ReactiveFormsModule,

    MatToolbarModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatBottomSheetModule,
    MatSnackBarModule, 
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTooltipModule, MatMenuModule,MatTabsModule,MatListModule,
    MatTableModule,MatPaginatorModule, 
    MatStepperModule, MatAutocompleteModule,MatSlideToggleModule,MatSidenavModule,
    MatDatepickerModule, MatNativeDateModule,

    // 3. Initialize
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    //provideFirestore(() => getFirestore()),
    provideFirestore(() => {
      const firestore = getFirestore();
      //connectFirestoreEmulator(firestore, 'localhost', 8080);
      enableIndexedDbPersistence(firestore);
      return firestore;
    }),
    provideAuth(() => initializeAuth(getApp(), { 
      persistence: indexedDBLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    })),
    provideStorage(() => getStorage()),
    provideMessaging (() => getMessaging()),

    // 3. Initialize
    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFirestoreModule, // firestore
    // AngularFireAuthModule, // auth
    // AngularFireStorageModule, // storage

    // provideAuth(() => {
    //   if (Capacitor.isNativePlatform()) {
    //     return initializeAuth(getApp(), {
    //       persistence: indexedDBLocalPersistence,
    //     });
    //   } else {
    //     return getAuth();
    //   }
    // }),

    Ng2GoogleChartsModule, ImageCropperModule,  GoogleMapsModule,
    /*
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
    */
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

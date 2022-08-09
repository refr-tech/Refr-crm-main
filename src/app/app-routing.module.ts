import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsComponent } from './components/tabs/tabs.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ProfileComponent } from './components/tabs/profile/profile.component';

import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/tabs/dashboard/dashboard.component';
import { UsersComponent } from './components/tabs/users/users.component';
import { StoresComponent } from './components/tabs/stores/stores.component';
import { BurnComponent } from './components/tabs/burn/burn.component';
import { LogisticsComponent } from './components/tabs/logistics/logistics.component';
import { TransactionsComponent } from './components/tabs/transactions/transactions.component';
import { IntegrationsComponent } from './components/tabs/integrations/integrations.component';
import { OrdersComponent } from './components/tabs/users/orders/orders.component';
import { ActivityComponent } from './components/tabs/users/activity/activity.component';
import { CampaignsComponent } from './components/tabs/stores/campaigns/campaigns.component';
import { ProductsComponent } from './components/tabs/stores/products/products.component';
import { StoreComponent } from './components/tabs/stores/store/store.component';
import { ProductComponent } from './components/tabs/stores/products/product/product.component';
import { CampaignComponent } from './components/tabs/stores/campaigns/campaign/campaign.component';
import { ProductSearchComponent } from './components/tabs/stores/products/product-search/product-search.component';
import { CampaignSearchComponent } from './components/tabs/stores/campaigns/campaign-search/campaign-search.component';
import { BurnCatComponent } from './components/tabs/burn/burn-cat/burn-cat.component';
import { BurnReqComponent } from './components/tabs/burn/burn-req/burn-req.component';
import { BurnListComponent } from './components/tabs/burn/burn-list/burn-list.component';

const routes: Routes = [

  
  {path:'', component: WelcomeComponent},
  
  { path:'', component:TabsComponent, canActivate: [AuthGuard], children: [
    {path:'', redirectTo:'/dash', pathMatch:"full" },
    {path:'dash', component: DashboardComponent, canActivate: [AuthGuard] },


    {path:'list-users', component: UsersComponent, canActivate: [AuthGuard] },
    {path:'user/:uid', component: ActivityComponent, canActivate: [AuthGuard] },

    {path:'user/orders', component: OrdersComponent, canActivate: [AuthGuard] },
    {path:'user/orders/:id', component: OrdersComponent, canActivate: [AuthGuard] },
    
    //{path:'user/activity', component: ActivityComponent, canActivate: [AuthGuard] },
    //{path:'user/activity/:id', component: ActivityComponent, canActivate: [AuthGuard] },


    {path:'list-stores', component: StoresComponent, canActivate: [AuthGuard] },
    {path:'store/:id', component: StoreComponent, canActivate: [AuthGuard] },

    {path:'campaigns', component: CampaignSearchComponent, canActivate: [AuthGuard] },
    {path:'campaigns/:storeID', component: CampaignsComponent, canActivate: [AuthGuard] },
    {path:'store/campaign/:id', component: CampaignComponent, canActivate: [AuthGuard] },

    {path:'products', component: ProductSearchComponent, canActivate: [AuthGuard] },
    {path:'products/:storeID', component: ProductsComponent, canActivate: [AuthGuard] },
    {path:'store/product/:id', component: ProductComponent, canActivate: [AuthGuard] },


    {path:'logistics', component: LogisticsComponent, canActivate: [AuthGuard] },
    {path:'burn', component: BurnComponent, canActivate: [AuthGuard] },
    {path:'burn-list', component: BurnListComponent, canActivate: [AuthGuard] },
    {path:'burn-requests', component: BurnReqComponent, canActivate: [AuthGuard] },
    {path:'burn-catagory', component: BurnCatComponent, canActivate: [AuthGuard] },

    {path:'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
    {path:'transactions/:id', component: TransactionsComponent, canActivate: [AuthGuard] },
    
    {path:'integrations', component: IntegrationsComponent, canActivate: [AuthGuard] },
    {path:'settings', component: ProfileComponent, canActivate: [AuthGuard] },
  ] },

  //{path:'store/:what', component: StoreCreateComponent, canActivate: [AuthGuard] },



  {path:'welcome', component: WelcomeComponent},
  {path:'404', component: WelcomeComponent},
  { path:'**', redirectTo:'/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

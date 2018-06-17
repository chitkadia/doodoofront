import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PricingComponent } from './pricing/pricing.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';

const routes: Routes =[
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
  }]},
    { path: 'product/:prod_id/:cat_id/detail',      component: ProductDetailComponent },
    { path: 'login',   component: LoginComponent },
    { path: 'signup',   component: SignupComponent },
    { path: 'books',     component: ProductsComponent },
    { path: 'toys',     component: ProductsComponent },
    { path: 'shopping-cart',     component: ShoppingCartComponent },
    { path: 'pricing',     component: PricingComponent },
    { path: 'contact-us',       component: ContactUsComponent },
    { path: 'reset-password/:id',           component: ResetPasswordComponent },
    // { path: 'notifications',  component: NotificationsComponent },
    // { path: 'upgrade',        component: UpgradeComponent },
    // { path: '',               redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }

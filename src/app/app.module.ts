import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 

import {
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    MatRippleModule,
    MatTooltipModule,
    MatDialogModule
} from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { UsersModule } from './user/users.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { LoginComponent, ForgotPassword } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';

import { CommonService } from './shared/common.service';
import { GridService } from './shared/grid.service';
import { AuthGuard } from './guards/auth.guard';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { ShoppingCartComponent, CheckoutDialog } from './shopping-cart/shopping-cart.component';
import { PricingComponent, PricingPaymentProcessDialog } from './pricing/pricing.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        UsersModule,
        CommonModule,
        HttpClientModule,
        MatSnackBarModule,
        MatButtonModule,
        MatInputModule,
        MatRippleModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatBottomSheetModule,
        MatListModule,
        MatSelectModule,
        MatDialogModule,
        MatTabsModule,
        SharedModule,
        MatExpansionModule,
        MatRadioModule,
        MatCheckboxModule
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        DashboardComponent,
        ProductsComponent,
        LoginComponent,
        SignupComponent,
        ForgotPassword,
        ProductDetailComponent,
        ShoppingCartComponent,
        // PaymentProcessDialog,
        PricingComponent,
        PricingPaymentProcessDialog,
        CheckoutDialog,
        ContactUsComponent,
        ResetPasswordComponent
    ],
    providers: [
        CommonService,
        GridService,
        AuthGuard
    ],
    entryComponents: [
        ForgotPassword,
        // PaymentProcessDialog,
        PricingPaymentProcessDialog,
        CheckoutDialog
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

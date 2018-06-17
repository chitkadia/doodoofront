import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { QuillModule } from 'ngx-quill';
// import { FileSelectDirective } from 'ng2-file-upload';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { SharedModule } from '../../shared/shared.module';

// import { DashboardComponent } from '../../dashboard/dashboard.component';
// import { ProductsComponent, ViewSubCategory, BottomSheetOverviewProDeletePopup } from '../../products/products.component';
// import { ProductCreateComponent } from '../../products/product-create/product-create.component';
// import { ProductUpdateComponent } from '../../products/product-update/product-update.component';
// import { ProductImagesComponent, AddProductImageDialog, BottomSheetOverviewImgDeletePopup } from '../../products/product-images/product-images.component';
import { LogoutComponent } from '../../user/logout/logout.component';
// import { LoginComponent } from '../../user/login/login.component';
// import { SignupComponent } from '../../user/signup/signup.component';

import {
    MatButtonModule,
    MatInputModule,
    MatRippleModule,
    MatTooltipModule,
} from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatRippleModule,
        MatInputModule,
        MatTooltipModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatBottomSheetModule,
        MatListModule,
        MatSelectModule,
        QuillModule,
        SharedModule
    ],
    declarations: [
        // DashboardComponent,
        LogoutComponent,
        // ProductsComponent,
        // ProductCreateComponent,
        // ViewSubCategory,
        // BottomSheetOverviewProDeletePopup,
        // ProductUpdateComponent,
        // ProductImagesComponent,
        // FileSelectDirective,
        // AddProductImageDialog,
        // BottomSheetOverviewImgDeletePopup
        // LoginComponent,
        // SignupComponent
    ],
    entryComponents: [
        // ViewSubCategory,
        // BottomSheetOverviewProDeletePopup,
        // AddProductImageDialog,
        // BottomSheetOverviewImgDeletePopup
    ]
})

export class AdminLayoutModule { }

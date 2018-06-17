import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { LogoutComponent } from '../../user/logout/logout.component';
import { ProductsComponent } from '../../products/products.component';

import { AuthGuard } from '../../guards/auth.guard';
import { LoginComponent } from '../../user/login/login.component';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    // { path: '',      component: LoginComponent, canActivate: [AuthGuard] },
    // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    // { path: 'books', component: ProductsComponent, canActivate: [AuthGuard] },
    // { path: 'toys', component: ProductsComponent, canActivate: [AuthGuard] },
    // { path: 'product/:prod_id/:cat_id/detail', component: ProductsComponent, canActivate: [AuthGuard] },
    // { path: 'contactus-leads', component: ContactusLeadsComponent, canActivate: [AuthGuard] },
    // { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] }
];

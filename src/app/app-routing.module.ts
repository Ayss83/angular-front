import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { loggedGuard } from './guards/logged.guard';
import { HomeMenuComponent } from './home-menu/home-menu.component';
import { InvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { InvoiceEditComponent } from './invoice/invoice-edit/invoice-edit.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductEditComponent } from './product/product-edit/product-edit.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [loggedGuard],
    children: [
      { path: '', component: HomeMenuComponent },
      {
        path: 'invoices',
        children: [
          { path: '', component: InvoiceListComponent },
          { path: 'edit', component: InvoiceEditComponent },
        ],
      },
      {
        path: 'customers',
        children: [
          { path: '', component: CustomerListComponent },
          { path: 'edit', component: CustomerEditComponent },
        ],
      },
      {
        path: 'products',
        children: [
          { path: '', component: ProductListComponent },
          { path: 'edit', component: ProductEditComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

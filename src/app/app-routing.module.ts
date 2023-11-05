import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedGuard } from './guards/logged.guard';
import { LoginComponent } from './components/authentication/login/login.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { CompanyComponent } from './components/company/company.component';
import { CustomerEditComponent } from './components/customer/customer-edit/customer-edit.component';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { HomeMenuComponent } from './components/home/home-menu/home-menu.component';
import { HomeComponent } from './components/home/home.component';
import { InvoiceEditComponent } from './components/invoice/invoice-edit/invoice-edit.component';
import { InvoiceListComponent } from './components/invoice/invoice-list/invoice-list.component';
import { ProductEditComponent } from './components/product/product-edit/product-edit.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';


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
      { path: 'company', component: CompanyComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

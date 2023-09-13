import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { loggedGuard } from './guards/logged.guard';
import { HomeMenuComponent } from './home-menu/home-menu.component';
import { InvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { InvoiceEditComponent } from './invoice/invoice-edit/invoice-edit.component';

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
        component: InvoiceListComponent,
      },
      { path: 'invoices/new', component: InvoiceEditComponent },
      { path: 'invoices/:id', component: InvoiceEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

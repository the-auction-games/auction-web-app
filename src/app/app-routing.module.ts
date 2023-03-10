import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { EditAuctionComponent } from './edit-auction/edit-auction.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MarketComponent } from './market/market.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PageViewAuctionComponent } from './page-view-auction/page-view-auction.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './services/auth/auth.service';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  { path: 'account/:accountId', component: AccountComponent, canActivate: [AuthService] },
  { path: 'account', component: AccountComponent, pathMatch: 'full', canActivate: [AuthService]},
  { path: 'market/new', component: EditAuctionComponent, canActivate: [AuthService] },
  { path: 'market/edit/:auctionId', component: EditAuctionComponent, canActivate: [AuthService] },
  { path: 'market/:auctionId', component: PageViewAuctionComponent, canActivate: [AuthService] },
  { path: 'market', component: MarketComponent, pathMatch: 'full', canActivate: [AuthService] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

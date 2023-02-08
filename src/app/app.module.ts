import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { MarketComponent } from './market/market.component';
import { RegisterComponent } from './register/register.component';
import { GridViewAuctionComponent } from './grid-view-auction/grid-view-auction.component';
import { PageViewAuctionComponent } from './page-view-auction/page-view-auction.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    MarketComponent,
    RegisterComponent,
    GridViewAuctionComponent,
    PageViewAuctionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

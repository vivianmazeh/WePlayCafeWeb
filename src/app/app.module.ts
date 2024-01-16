import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';
import { MainComponent } from './Components/main/main.component';
import { BuyTicketsComponent } from './Components/buy-tickets/buy-tickets.component';
import { PriceComponent } from './Components/price/price.component';
import { CafeComponent } from './Components/cafe/cafe.component';
import { GalleryComponent } from './Components/gallery/gallery.component';
import { ContactUsComponent } from './Components/contact-us/contact-us.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PriceComponent,
    CafeComponent,
    GalleryComponent,
    ContactUsComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    BuyTicketsComponent,
    BuyTicketsComponent,
    PriceComponent,
    CafeComponent,
    GalleryComponent,
    ContactUsComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbCollapseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

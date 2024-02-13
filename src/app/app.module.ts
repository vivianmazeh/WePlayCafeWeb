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
import { BookPartySelectDateComponent } from './Components/book-party-select-date/book-party-select-date.component';
import { PriceComponent } from './Components/price/price.component';
import { WaiverComponent } from './Components/waiver/waiver.component';
import { GalleryComponent } from './Components/gallery/gallery.component';
import { ContactUsComponent } from './Components/contact-us/contact-us.component';
import { GoogleMapsModule } from '@angular/google-maps'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PriceComponent,
    WaiverComponent,
    GalleryComponent,
    ContactUsComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    BuyTicketsComponent,
    BuyTicketsComponent,
    PriceComponent,
    GalleryComponent,
    ContactUsComponent,
    BookPartySelectDateComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbCollapseModule,
    GoogleMapsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

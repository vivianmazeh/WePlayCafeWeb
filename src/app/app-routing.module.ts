import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import  {WaiverComponent} from './Components/waiver/waiver.component'
import { PriceComponent } from './Components/price/price.component';
import { GalleryComponent } from './Components/gallery/gallery.component';
import { ContactUsComponent } from './Components/contact-us/contact-us.component';
import { CityProfileComponent } from './Components/city-profile/city-profile.component';
import { BuyTicketComponent } from './Components/buy-ticket/buy-ticket.component';
import { CancelSubscriptionComponent } from './Components/cancel-subscription/cancel-subscription.component';
import { RulesComponent } from './Components/rules/rules.component';
import { MenuComponent } from './Components/menu/menu.component';


// sets up routes constant where you define your routes
const routes: Routes = [

  {path: 'home', component: HomeComponent},
  {path: 'waiver', component: WaiverComponent},
  {path: 'price', component: PriceComponent},
  {path: 'gallery', component: GalleryComponent},
  {path: 'contactUs', component: ContactUsComponent},
  {path: 'city-profile', component: CityProfileComponent},
  {path: 'card-payment', component: BuyTicketComponent},
  {path: 'rules', component: RulesComponent},
  {path: 'menu', component: MenuComponent},
   {path: 'cancel-subscription/:subscriptionId', 
   component: CancelSubscriptionComponent},
  {path: '', redirectTo: 'home', pathMatch : 'full'},

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



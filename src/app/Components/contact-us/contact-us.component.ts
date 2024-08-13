
import { Component, OnInit} from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  map: google.maps.Map | undefined;

  ngOnInit(): void {
    this.initMap();
  }
 

  async  initMap(): Promise<void> {
   
   // const { Map} = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const center = {lat: 42.2550302, lng: -83.2543};
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: center,
      zoom: 15,
    });

    const market = new google.maps.Marker({
      position: center,
      map: this.map,
      icon: {
        url: '../assets/icons/weplay/__Insta Profile.jpg',
        scaledSize: new google.maps.Size(50, 50) 
      },
      title: 'WePlay Cafe'
    });
  }
  

}




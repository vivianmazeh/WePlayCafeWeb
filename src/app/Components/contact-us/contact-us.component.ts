
import { Component, OnInit} from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  private map!: google.maps.Map;

  ngOnInit(): void {
    this.initMap();
  }
 
  async  initMap(): Promise<void> {
   
    await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
   // const { Map} = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const center = {lat: 42.2550302, lng: -83.2543};
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: center,
      zoom: 15,
      mapId: 'a573258af1b0cb2a'
    });

    const customElement = document.createElement('div');
    const imgElement = document.createElement('img');
    imgElement.src = '../assets/icons/weplay/__Insta Profile.jpg';
    imgElement.style.width = '50px';
    imgElement.style.height = '50px';
    imgElement.style.borderRadius = '50%'; 

    customElement.appendChild(imgElement);

    const  marker = new google.maps.marker.AdvancedMarkerElement({
      position: center,
      map: this.map,
      title: 'WePlay Cafe',
      content: customElement
      
    });
  }

}




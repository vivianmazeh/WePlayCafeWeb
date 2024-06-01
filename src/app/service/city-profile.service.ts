import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { CityProfile } from '../model/city-profile';


@Injectable({
  providedIn: 'root'
})
export class CityProfileService {



  private localBaseUrl: string ="http://www.localhost:8080/weplay/cityprofiles";
  private originUrl: string = 'http://localhost:4200';


  constructor(private http: HttpClient) { }

    

getCityProfile(stateName: String): Observable<CityProfile[]> {

     // Set up the headers to include CORS
     const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': this.originUrl
      // Add any other required headers
    });

  return this.http.get<CityProfile[]>(`${this.localBaseUrl}/${stateName}`, {headers}).pipe(
    map(data => data.map( item => new CityProfile(
      item.city_name,
      item.total_population,
      item.under_10,
      item.median_household_income,
      item.employment_rate,
      item.house_units,
      item.poverty_rate,
      item.total_race,
      item.race_asian,
      item.race_white,
      item.race_black
    )))
  );
}

}

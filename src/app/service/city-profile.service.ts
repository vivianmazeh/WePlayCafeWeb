import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { CityProfile } from '../model/city-profile';
import { environment } from '../environments/env';


@Injectable({
  providedIn: 'root'
})
export class CityProfileService {

  baseUrl = environment.baseUrl;
  originalUrl = environment.originalUrl;

 private url: string = this.baseUrl + "cityprofiles";

  constructor(private http: HttpClient) { }

    

getCityProfile(stateName: String): Observable<CityProfile[]> {

     // Set up the headers to include CORS
     const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': this.originalUrl
      // Add any other required headers
    });

  return this.http.get<CityProfile[]>(`${this.url}/${stateName}`, {headers : { 'Content-Type': 'application/json' }}).pipe(
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

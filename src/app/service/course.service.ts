import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../model/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private baseUrl: string ="http://easytolearn.us-east-2.elasticbeanstalk.com/learningApp/education"

  constructor(private http: HttpClient) {}

  
  findAllBook(): Observable <Course[]>{

      // Set up the headers to include CORS
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://angular-easy-to-learn-web.s3-website.us-east-2.amazonaws.com'
        // Add any other required headers
      });

    return this.http.get<Course[]>(`${this.baseUrl}/allbooks`, { headers });
  
  }
  
}


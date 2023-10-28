import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../model/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private baseUrl: string ="http://localhost:8080/learningApp/education"

  constructor(private http: HttpClient) {}

  
  findAllBook(): Observable <Course[]>{

    return this.http.get<Course[]>(`${this.baseUrl}/allbooks`);
    
  }
  
}


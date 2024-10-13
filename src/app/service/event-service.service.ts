import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';


@Injectable({
    providedIn: 'root'
  })
export class EventService {

    private ProbaseUrl: string ="http://easytolearn.us-east-2.elasticbeanstalk.com/learningApp/education";
    private localBaseUrl: string ="http://www.localhost:8080/education";
    private s3Url: string = "http://angular-easy-to-learn-web.s3-website.us-east-2.amazonaws.com";
    private originUrl: string = 'http://localhost:4200';

    constructor() {}
}


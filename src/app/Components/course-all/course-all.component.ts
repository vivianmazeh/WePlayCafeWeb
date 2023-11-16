import { Component } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { Course } from '../../model/course';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-course-all',
  templateUrl: './course-all.component.html',
  styleUrls: ['./course-all.component.css']
})
export class CourseAllComponent {

  courses: Course[] = [];
  constructor(private service: CourseService){}
  
  ngOnInit(): void {
    console.log("ngonInit function hit");
    this.getAllCourse();
  }
  getAllCourse(){

    console.log("called getAllCourse function");
    this.service.findAllBook().subscribe({
      next: (v) => {this.courses = v;
                    console.log(v)},
      error: (e) => {this.courses = [];
                     console.log(e);},
      complete: () => console.info('complete') 
  })
  }



}

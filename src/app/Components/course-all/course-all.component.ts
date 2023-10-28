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
  message = "I'm read only!";
  canEdit = false;
 

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

  onEditClick() {
    this.canEdit = !this.canEdit;
    if (this.canEdit) {
      this.message = 'You can edit me!';
    } else {
      this.message = "I'm read only!";
    }
  }

}

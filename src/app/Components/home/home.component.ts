import { Component } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { Course } from '../../model/course';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  courses: Course[] = [];
  pageContent: any[] = [];


  constructor(private service: CourseService){

    this.pageContent = [ {subtitle: 'Michigan winters have long shadows, but at WePlay & Cafe, the sun always shines inside. We are not just an indoor playground - ' +
                                    'we are a haven for kids to discover the joy of play, fostering essential social skills while offering a much-needed respite from excessive screen time.' + 
                                    ' While the little ones embark on exciting adventures, parents can unwind in our luxurious cafe area.' +
                                    ' Catch up with friends, savor delicious treats, and relish the comfort of knowing your child is in a secure, clean, and enjoyable environment.'},
                         {subtitle: "WePlay & Cafe takes the hassle out of birthday parties, leaving you to savor the smiles and celebrate life's little rock stars. " +
                                    "Step into our brand new, beautifully renovated private birthday party room. " + 
                                   "It's your space to create the perfect celebration – play your own music, decorate to your heart's content, and make it uniquely yours. "+
                                   "As part of our exclusive birthday party package, we provide a high-quality projector for you to share cherished pictures and videos with your guests."},

                          {subtitle: "We are thrilled to extend a warm welcome to daycare centers, preschools, summer camps, homeschool groups, and anyone seeking imagination and adventure." +
                                     " Get ready to climb, crawl,  swing, and slide through exciting obstacles that'll boost children's strength, speed, coordination, and teamwork. " },
                          { subtitle:
                                     "At our facility, creativity takes center stage, immerse your children in a world of puzzles, Lego activities, engineering wall games, and themed areas designed to ignite their creativity while ensuring a fantastic time. " +
                                     "Our specially curated toddler soft-play area is a magical haven for little ones aged 0-3 years. " +
                                     " It features a nontoxic and safety-tested sand pit area, a music dancing panel, a spinning seat, and an array of soft play toys, providing the perfect environment for developing motor skills and sensory awareness. "},
                          {subtitle:
                                     " And guess what? We know every group is unique, so we've got flexible and customizable field trip programs just for you. Give us a call, and let the adventure unfold!"},
                        
  ];
  }
  
  ngOnInit(): void {
  
   // this.getAllCourse();
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseAllComponent } from './Components/course-all/course-all.component';
import { CourseAddComponent } from './Components/course-add/course-add.component';

// sets up routes constant where you define your routes
const routes: Routes = [

  {path: 'all', component: CourseAllComponent},
  {path: 'add', component : CourseAddComponent},
  {path: '', redirectTo: 'all', pathMatch : 'full'},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



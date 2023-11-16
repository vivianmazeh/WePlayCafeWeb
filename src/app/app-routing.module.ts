import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseAllComponent } from './Components/course-all/course-all.component';
import { CourseAddComponent } from './Components/course-add/course-add.component';
import { CourseEditComponent } from './Components/course-edit/course-edit.component';

// sets up routes constant where you define your routes
const routes: Routes = [

  {path: 'all', component: CourseAllComponent},
  {path: 'add', component : CourseAddComponent},
  {path: 'edit', component: CourseEditComponent},
  {path: '', redirectTo: 'all', pathMatch : 'full'},
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



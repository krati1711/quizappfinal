import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeleteComponent } from './delete/delete.component';
import { AddQuestionComponent } from './add/add-question/add-question.component';
import { AddQuizComponent } from './add/add-quiz/add-quiz.component';



@NgModule({
  declarations: [LoginComponent, DashboardComponent, DeleteComponent, AddQuestionComponent, AddQuizComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }

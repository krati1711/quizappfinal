import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './quiz-frontend/start/start.component';
import { QuizComponent } from './quiz-frontend/quiz/quiz.component';
import { FinishComponent } from './quiz-frontend/finish/finish.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './admin/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { RoleGuard } from './auth/role.guard';
import { AddQuizComponent } from './admin/add/add-quiz/add-quiz.component';
import { AddQuestionComponent } from './admin/add/add-question/add-question.component';
import { DeleteComponent } from './admin/delete/delete.component';
import { ViewQuestionsComponent } from './admin/view-questions/view-questions.component';


const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: { role:'admin' }
  },
  {
    path: 'add-quiz', component: AddQuizComponent, canActivate: [RoleGuard], data: { role:'admin' }
  },
  {
    path: 'add-question', component: AddQuestionComponent, canActivate: [RoleGuard], data: { role:'admin' }
  },
  {
    path: 'view-questions', component: ViewQuestionsComponent, canActivate: [RoleGuard], data: { role:'admin' }
  },
  {
    path: 'delete', component: DeleteComponent, canActivate: [RoleGuard], data: { role:'admin' }
  },
  {
    path: 'finish', component: FinishComponent, canActivate: [AuthGuard], data: { role:'user' }
  },
  {
    path: 'adminlogin', component: LoginComponent
  },
  {
    path: 'quiz', component: QuizComponent, canActivate: [AuthGuard], data: { role:'user' }
  },
  {
    path: '', component: StartComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

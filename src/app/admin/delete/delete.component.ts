import { Component, OnInit, OnDestroy } from '@angular/core';
import { Quiz } from 'src/app/quiz-frontend/models/Quiz';
import { FormGroup } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit, OnDestroy {

  // Subscription
  private getQuiz$: Subscription = new Subscription();
  private delQuiz$: Subscription = new Subscription();

  addQuestion: FormGroup;
  quizList: Quiz[] = [];
  quizId: string = "";

  constructor(private adminService: AdminService, private router: Router) {
    this.getQuiz$ = adminService.getAllQuiz().subscribe(res => {
      this.quizList = res.quizes;
      this.quizId = this.quizList[0]._id;
    },
    err => {
      console.log(err);
    });
  }

  ngOnDestroy(): void {
    this.getQuiz$.unsubscribe();
    this.delQuiz$.unsubscribe();
  }

  ngOnInit(): void {
  }

  get quizName() {
    return this.addQuestion.get('quiz_name');
  }

  changeQuiz(e) {
    this.quizId = e.target.value;
  }

  deleteQuiz(){
    this.delQuiz$ = this.adminService.deleteQuiz(this.quizId).subscribe(
      res => {
        if (res.status == 'success'){
          alert('Quiz deleted');
          this.router.navigate(['/dashboard']);
        }
        else {
          alert('Problem in deleting Quiz, Contact Administrator');
        }
      },
      err => {
        console.log(err);
      }
    )
  }

  gotoDashboard(){
    this.router.navigate(['/dashboard']);
  }

  gotoAddQuestionClick(){
    this.router.navigate(['/add-question']);
  }

  gotoViewClick(){
    this.router.navigate(['/view-questions']);
  }

  gotoDeleteClick(){
    this.router.navigate(['/delete']);
  }

}

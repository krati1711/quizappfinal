import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Quiz } from 'src/app/quiz-frontend/models/Quiz';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit, OnDestroy {

  //subscription
  private getQuiz$: Subscription = new Subscription();
  private addQuestion$: Subscription = new Subscription();

  addQuestion: FormGroup;
  quizList: Quiz[] = [];
  quizId: string = '';
  addSubmitted = false;

  constructor(private adminService: AdminService, private router: Router, private formBuilder: FormBuilder) {
    this.getQuiz$ = adminService.getAllQuiz().subscribe(res => {
      this.quizList = res.quizes;
    },
      err => {
        console.log(err);
      });
  }

  ngOnDestroy(): void {
    this.getQuiz$.unsubscribe();
    this.addQuestion$.unsubscribe();
  }

  ngOnInit(): void {
    this.addQuestion = this.formBuilder.group({
      new_question: ['', Validators.required],
      correct_answer: ['', Validators.required],
      wrong_answer: ['', Validators.required],
      quiz_name: ['', Validators.required]
    });
  }

  get quizName() {
    return this.addQuestion.get('quiz_name');
  }

  get f() { return this.addQuestion.controls; }

  changeQuiz(e) {
    this.quizId = e.target.value.split(": ")[1];
  }

  onSubmit() {
    this.addSubmitted = true;

    if (this.addQuestion.invalid) {
      return;
    }
    this.addQuestion$ = this.adminService.addQuestion(this.addQuestion.get('new_question').value, this.addQuestion.get('correct_answer').value, this.addQuestion.get('wrong_answer').value, this.quizId)
      .subscribe(res => {
        this.addQuestion.reset();
        alert('Question added');
      },
        err => {
          console.log(err);
        });
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

  gotoCreateQuiz(){
    this.router.navigate(['/add-quiz']);
  }
}

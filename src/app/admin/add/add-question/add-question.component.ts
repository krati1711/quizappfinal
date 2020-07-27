import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Quiz } from 'src/app/quiz-frontend/models/Quiz';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent implements OnInit {

  addQuestion: FormGroup;
  quizList: Quiz[] = [];
  quizId: string = '';

  constructor(private adminService: AdminService, private router: Router) {
    adminService.getAllQuiz().subscribe(res => {
      console.log(res);
      this.quizList = res.quizes;
    },
      err => {
        console.log(err);
      });
  }

  ngOnInit(): void {
    this.addQuestion = new FormGroup({
      new_question: new FormControl(null),
      correct_answer: new FormControl(null),
      wrong_answer: new FormControl(null),
      quiz_name: new FormControl(null)
    });
  }

  get quizName() {
    return this.addQuestion.get('quiz_name');
  }

  changeQuiz(e) {
    this.quizId = e.target.value.split(": ")[1];
  }

  onSubmit() {
    console.log(this.addQuestion.get('new_question').value, this.addQuestion.get('correct_answer').value, this.addQuestion.get('wrong_answer').value, this.quizId);
    this.adminService.addQuestion(this.addQuestion.get('new_question').value, this.addQuestion.get('correct_answer').value, this.addQuestion.get('wrong_answer').value, this.quizId)
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

  gotoDeleteClick(){
    this.router.navigate(['/delete']);
  }

  gotoCreateQuiz(){
    this.router.navigate(['/add-quiz']);
  }
}

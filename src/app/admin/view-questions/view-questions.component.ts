import { Component, OnInit } from '@angular/core';
import { Quiz } from 'src/app/quiz-frontend/models/Quiz';
import { FormGroup } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-questions',
  templateUrl: './view-questions.component.html',
  styleUrls: ['./view-questions.component.css']
})
export class ViewQuestionsComponent implements OnInit {
 // Subscription
 private getQuiz$: Subscription = new Subscription();
 private getQuestions$: Subscription = new Subscription();
 private deleteQuestion$: Subscription = new Subscription();

 addQuestion: FormGroup;
 quizList: Quiz[] = [];
 quizId: string = "";
 doWeHaveQuestions = false;
 questions: any[] = [];

 constructor(private adminService: AdminService, private router: Router) {

    // adding scroll to page
    document.body.style.overflow = "scroll";

   this.getQuiz$ = adminService.getAllQuiz().subscribe(res => {
       this.quizList = res.quizes;
       this.quizId = this.quizList[0]._id;
     },
     err => {
       console.log(err);
     });
  }

 ngOnInit(): void {
 }

 get quizName() {
   return this.addQuestion.get('quiz_name');
 }

 changeQuiz(e) {
   this.quizId = e.target.value;
 }

 viewQuestion() {
    this.doWeHaveQuestions = false;
    this.getQuestions$ = this.adminService.getQuestions(this.quizId).subscribe(
        (data:any) => {this.questions = data.question},
        err => console.log(err),
        () => { this.doWeHaveQuestions = true});
 }

 deleteQuestion(id: string, question: string, answer: string) {
    const cbox = confirm("Do you want to delete? \n" + question + answer);
    if (cbox) {
        this.deleteQuestion$ = this.adminService.deleteQuestion(id).subscribe(
            (res: any) => {
                if (res.status == 'success'){
                  // this.router.navigate(['/view-questions']);
                  window.location.reload();
                }
                else {
                  alert('Problem in deleting Quiz, Contact Administrator');
                }
              },
              err => {
                console.log(err);
              }
        );
    }
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

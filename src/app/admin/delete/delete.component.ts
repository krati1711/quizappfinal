import { Component, OnInit } from '@angular/core';
import { Quiz } from 'src/app/quiz-frontend/models/Quiz';
import { FormGroup } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  addQuestion: FormGroup;
  quizList: Quiz[] = [];
  quizId: string = "";
  
  constructor(private adminService: AdminService, private router: Router) {
    adminService.getAllQuiz().subscribe(res => {
      console.log(res);
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
    // console.log('target -' + e.target.value);
    // this.quizId = e.target.value.split(": ")[1];
    this.quizId = e.target.value;
    // console.log('changes quizid-'+this.quizId);
  }

  deleteQuiz(){
    console.log(this.quizId);
    this.adminService.deleteQuiz(this.quizId).subscribe(
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

  gotoDeleteClick(){
    this.router.navigate(['/delete']);
  }

}

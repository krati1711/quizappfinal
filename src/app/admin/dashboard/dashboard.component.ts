import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  addQuestion: FormGroup;
  quizList: any[] = [];
  quizId: string = '';
  studentList: any[] = [];
  userDetail = null;
  responses: any[] = [];
  userScore: number;

  doWeHaveStudents = false;
  doWeHaveResponse = false;

  constructor(private adminService: AdminService, private router: Router) {

    // adding scroll to page
    document.body.style.overflow = "scroll";
   }

  ngOnInit(): void {
    this.adminService.getAllQuiz().subscribe(result => {
      this.quizList = result.quizes;
      this.quizId = this.quizList[0]._id;
    },
    err => {
      console.log(err);
      alert(err.errorMessage);
    });
  }

  get quizName() {
    return this.addQuestion.get('quiz_name');
  }
  
  changeQuiz(e) {
    // console.log('target -' + e.target.value);
    // this.quizId = e.target.value.split(": ")[1];
    this.quizId = e.target.value;
    console.log('quizid changed-' + this.quizId);
  }

  getStudents() {
    this.doWeHaveResponse = false;
    console.log('quizid in getStudent-' + this.quizId)
    this.adminService.getStudents(this.quizId).subscribe( res => {
      this.studentList = res.student;
    }
    ,err => {
      alert('Error getting Students from Database');
      alert(err.errorMessage);
    },
    () => {
      if (this.studentList.length !== 0){
        this.doWeHaveStudents = true;
      }
    });
  }

  getResponses(userid: string) {
    this.userScore = 0;
    this.adminService.getResponsesperQuiz(this.quizId, userid)
      .subscribe(res=> {
        this.userDetail = res.user;
        this.responses = res.responses;
        this.responses.forEach( x => {
          if (x.chosenAnswer.trim() === x.correctAnswer.trim()) {
            this.userScore++;
          }
        });
      },
       err => {
         alert('Something wrong in fetching response of a particular student.');
         alert(err.errorMessage);
       },
       () => {
         this.doWeHaveResponse = true;
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
}

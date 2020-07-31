import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css']
})
export class AddQuizComponent implements OnInit {

  createQuiz: FormGroup;
  createQuizSubmitted = false;

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.createQuiz = new FormGroup({
      quiz_name: new FormControl('', [Validators.required])
    });
  }

  get f() { return this.createQuiz.controls; }

  onSubmit() {

    this.createQuizSubmitted = true;

    if (this.createQuiz.invalid) {
      return;
    }

    this.adminService.addQuiz(this.createQuiz.get('quiz_name').value).subscribe(result => {
      alert('Quiz created');
      this.router.navigate(['/add-question']);
    },
      err => {
        console.log(err);
      });
  }

  gotoDashboard() {
    this.router.navigate(['/dashboard']);
  }

  gotoAddQuestionClick() {
    this.router.navigate(['/add-question']);
  }

  gotoDeleteClick() {
    this.router.navigate(['/delete']);
  }
}

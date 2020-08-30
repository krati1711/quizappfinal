import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.css']
})
export class AddQuizComponent implements OnInit, OnDestroy {

  // subscription
  private addQuiz$: Subscription = new Subscription();

  createQuiz: FormGroup;
  createQuizSubmitted = false;

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnDestroy(): void {
    this.addQuiz$.unsubscribe();
  }

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

    this.addQuiz$ = this.adminService.addQuiz(this.createQuiz.get('quiz_name').value).subscribe(result => {
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

  gotoViewClick(){
    this.router.navigate(['/view-questions']);
  }

  gotoDeleteClick() {
    this.router.navigate(['/delete']);
  }
}

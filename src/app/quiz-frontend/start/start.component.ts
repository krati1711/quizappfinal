import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Quiz } from '../models/Quiz';
import { Router } from '@angular/router';
import { QuestionService } from '../services/question.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit, OnDestroy {

  registerForm!: FormGroup;
  loginForm!: FormGroup;
  registersubmitted = false;
  loginsubmitted = false;
  quizList: Quiz[] = [];
  quizId = '';

  signInpage = true;
  hasUsername = '';
  
  constructor(private formBuilder: FormBuilder, private questionService: QuestionService, private router: Router, private commonService: CommonService) { 

    // adding background to page
    document.body.style.backgroundImage = "url('../../../assets/background1.jpg')";

    // Getting quiz of list to select from
    questionService.getAllQuiz().subscribe(res => {
      this.quizList = res.quizes;
    },
      err => {
        console.log(err);
      });
  }
  ngOnDestroy(): void {
    console.log('on destry start');
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(20)]],
      gender: ['', Validators.required],
      email: [''],
    });

    this.loginForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      quizname: ['', [Validators.required]]
    });
  }

  get f() { return this.registerForm.controls; }
  get g() { return this.loginForm.controls; }

  // On Registration Submit Button Click
  onSubmit() {
    this.registersubmitted = true;
    let tempstatus: number;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    let tempuser: string;
    this.commonService.registerUser(this.registerForm.value.email, this.registerForm.value.name, this.registerForm.value.age, this.registerForm.value.gender)
      .subscribe(res => {
        tempuser = res.name;
        tempstatus = res.mystatuscode;
        this.hasUsername = res.uname;
        if (tempstatus === 1){
          localStorage.setItem('userdetails', JSON.stringify({username: res.username, quizid: this.registerForm.value.quizname}));
        }
      },
        err => {
          console.log('registration error-' + err);
          alert("Problem in register user");
        },
        () => {
          if (tempstatus === 0){
            alert("User Already Registered");
            this.registerForm.reset();
          }
          else if (localStorage.getItem('userdetails')) {
            this.registerForm.reset();
            alert('Registered Successfully!');
          }
          localStorage.removeItem('userdetails');
        });
  }

  // On Clicking Submit button in Login Form
  onLoginSubmit() {
    this.loginsubmitted = true;
    let tempstatus: number;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.commonService.loginUser(this.loginForm.value.name, this.loginForm.value.quizname)
      .subscribe(res => {
        tempstatus = res.mystatuscode;
        if (tempstatus === 1){
          this.commonService.storeAccess(res.token);
          localStorage.setItem('userdetails', JSON.stringify({username: res.username, quizid: this.loginForm.value.quizname}));
        }
        else if (tempstatus === 2){
          alert('You have already given this quiz');
          this.loginForm.reset();
        }
      },
        err => {
          console.log('login error-' + err);
          alert("Problem in login user");
        },
        () => {
          if (tempstatus === 0){
            alert("No such user found. Try Registering first");
            this.loginForm.reset();
          }
          else if (localStorage.getItem('userdetails') && tempstatus != 2) {
            this.router.navigate(['/quiz']);
          }
        });
  }

  // To toggle page between Login and Registration
  togglePage(){
    this.signInpage = !this.signInpage;
    if (!this.signInpage) {
      this.hasUsername = '';
    }
  }

  gotoAdmin(){
    this.router.navigate(['/adminlogin']);
  }
}

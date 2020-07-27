import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  loginError: string;

  constructor(private fb: FormBuilder, private router: Router, private commonService: CommonService) { }

  ngOnInit(): void {

    // adding background to page
    document.body.style.backgroundImage = "url('../../../assets/background1.jpg')";
    
    localStorage.clear();

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.commonService.removeAccess();
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.commonService.login(this.username.value, this.password.value).subscribe((data) => {
       if (this.commonService.isLoggedIn) {
          this.router.navigate(['/dashboard']);
        } else {
          this.loginError = 'Username or password is incorrect.';
        }
      },
      error => {
        alert(error);
      }
    );
  }

}

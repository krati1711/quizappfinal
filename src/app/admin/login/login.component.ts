import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  
  // subscription
  private loginSub$: Subscription = new Subscription();

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  loginError: string;

  constructor(private fb: FormBuilder, private router: Router, private commonService: CommonService) { }

  ngOnDestroy(): void {
    this.loginSub$.unsubscribe();
  }

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

    this.loginSub$ = this.commonService.login(this.username.value, this.password.value).subscribe((data) => {
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

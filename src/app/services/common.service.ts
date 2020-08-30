import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

let httpHeaders = new HttpHeaders({
  'Content-Type' : 'application/json',
  'Access-Control-Allow-Origin': '*'
});

let options = {
  headers: httpHeaders
};

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  registerUser(email:string , name:string, age:string, gender:string): Observable<any> {
    //return this.http.post<any>('http://localhost:3000/user/registerUser',{email: email, name: name, age: age, gender: gender}, options);
    return this.http.post<any>('/user/registerUser',{email: email, name: name, age: age, gender: gender}, options);
  }

  loginUser(username:string, quizid: string ): Observable<any> {
    //return this.http.post<any>('http://localhost:3000/user/loginUser', {name: username, quizid: quizid}, options);
    return this.http.post<any>('/user/loginUser', {name: username, quizid: quizid}, options);
  }

  login(username: string, password: string) {
    //return this.http.post<any>('http://localhost:3000/auth/login', JSON.stringify({email: username, password: password}), options)
    return this.http.post<any>('/auth/login', JSON.stringify({email: username, password: password}), options)
    .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUserToken', user.token);
        }
      })
    );
  }

  storeAccess(token: any) {
    localStorage.setItem('currentUserToken', token);
  }

  hasAccess(): boolean {
    const access = localStorage.getItem('currentUserToken');
    return (access === 'true') ?  true :  false;
  }

  getToken(){
    return localStorage.getItem('currentUserToken');
  }

  removeAccess() {
    if (localStorage.getItem('currentUserToken')) {
      localStorage.removeItem('currentUserToken');
    }
  }

  isLoggedIn() {
    if (localStorage.getItem('currentUserToken')) {
      return true;
    }
    return false;
  }
}

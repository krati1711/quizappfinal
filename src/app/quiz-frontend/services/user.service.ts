import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QuizResponse } from '../models/QuizResponse';
import { Observable } from 'rxjs';

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
export class UserService {

  constructor(private http: HttpClient) { }

  registerResponse(response: QuizResponse): Observable<any> {
    //return this.http.post<any>('http://localhost:3000/response/registerResponse', {EachResponses: response.EachResponses, username: response.username, quizid: response.quizid}, options);
    return this.http.post<any>('/response/registerResponse', {EachResponses: response.EachResponses, username: response.username, quizid: response.quizid}, options);
  }

}

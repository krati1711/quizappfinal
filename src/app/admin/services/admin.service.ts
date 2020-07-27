import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

let httpHeaders = new HttpHeaders({
  'Content-Type' : 'application/json',
  //'Cache-Control': 'no-cache',
  'Access-Control-Allow-Origin': '*',
  //'Access-Control-Allow-Credentials': 'true',
  //'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  //'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
});

let options = {
  headers: httpHeaders
};

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  addQuiz(quizName: String): Observable<any> {
    // return this.http.post<any>('http://localhost:3000/quiz/addQuiz', {quizName: quizName}, options);
    return this.http.post<any>('/quiz/addQuiz', {quizName: quizName}, options);
  }

  addQuestion(question: String, correct: String, incorrect: String, quizId: string): Observable<any> {
    // return this.http.post<any>('http://localhost:3000/question/addQuestion', {question: question, correct_answer: correct, wrong_answer: incorrect, quizId: quizId}, options);
    return this.http.post<any>('/question/addQuestion', {question: question, correct_answer: correct, wrong_answer: incorrect, quizId: quizId}, options);
  }

  deleteQuiz(quizid: string) {
    // return this.http.delete<any>('http://localhost:3000/quiz/deleteQuiz/' + quizid);
    return this.http.delete<any>('/quiz/deleteQuiz/' + quizid);
  }

  getStudents(quizid: string) {
    // return this.http.get<any>('http://localhost:3000/response/getResponseperQuiz/' + quizid);
    return this.http.get<any>('/response/getResponseperQuiz/' + quizid);
  }

  getResponsesperQuiz(quizid: string, userid: string) {
    // return this.http.get<any>('http://localhost:3000/user/userResponse/' + userid + '&' + quizid);
    return this.http.get<any>('/user/userResponse/' + userid + '&' + quizid);
  }

  getAllQuiz(): Observable<any> {
    // return this.http.get<any>('http://localhost:3000/quiz/getAllQuiz');
    return this.http.get<any>('/quiz/getAllQuiz');
  }
}

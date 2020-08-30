import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private httpClient: HttpClient) { }

  getAllQuiz(): Observable<any> {
    //return this.httpClient.get<any>('http://localhost:3000/quiz/getAllQuiz');
    return this.httpClient.get<any>('/quiz/getAllQuiz');
  }

  getQuestionPerQuiz(quizid: string): Observable<any> {
    //return this.httpClient.get<any>('http://localhost:3000/question/getQuestionsPerQuiz/' + quizid);
    return this.httpClient.get<any>('/question/getQuestionsPerQuiz/' + quizid);
  }
}

import { EachResponse } from './EachResponse';
export class QuizResponse {
    quizid: string;
    username: string
    EachResponses: EachResponse[] = [];

    constructor(quizid: string, username: string) {
        this.quizid = quizid;
        this.username = username;
    }

    addResponse(EachResponse: any) {
        this.EachResponses.push = EachResponse;
        console.log('response ke andar' + EachResponse.chosenAnswer);
    }
}

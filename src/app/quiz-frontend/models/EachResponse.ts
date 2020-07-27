export class EachResponse {
    questionid!: string;
    question!: string;
    chosenAnswer!: string;
    correctAnswer!: string;
    timeTaken!: number;
    answered!: boolean;

    constructor(questionid: string, question:string, chosenAnswer: string, correctAnswer:string, timeTaken: number, answered: boolean) {
        this.answered = answered;
        this.question = question;
        this.chosenAnswer = chosenAnswer;
        this.correctAnswer = correctAnswer;
        this.questionid = questionid;
        this.timeTaken = timeTaken;
    }
}

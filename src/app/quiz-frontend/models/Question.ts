export class Question{
    id: string;
    quest: string;
    options: Array<string>;
    answer: string;

    constructor(id: string, quest: string, options: Array<string>, answer: string) {
        this.id = id;
        this.quest = quest;
        this.options = options;
        this.answer = answer;
    }
}
import IAnswerData from "./Answer";

export default interface IQuestionData {
    questionId?: any | null;
    questionNumber : number;
    questionText: string;
    answers : IAnswerData[];
    time : number;
    theme :string;
  }
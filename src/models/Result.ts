import IQuestionData from "./Question"

export default interface IResultData {
  question: IQuestionData,
  firstAnswerRate: number,
  secondAnswerRate: number
}

export default interface IResultData {
  question: IQuestionData,
  firstAnswerText: string,
  secondAnswerText: string,
  firstAnswerRate: number,
  secondAnswerRate: number
}
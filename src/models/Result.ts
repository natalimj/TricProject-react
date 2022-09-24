import IAnswerData from "./Answer"
import IQuestionData from "./Question"

export default interface IResultData {
  question: IQuestionData,
  firstAnswer: IAnswerData,
  secondAnswer: IAnswerData,
  firstAnswerRate: number,
  secondAnswerRate: number
}
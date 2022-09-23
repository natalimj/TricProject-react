import { useState } from "react";
import IQuestionData from '../models/Question';
import WebSocketComponent from "./WebSocketComponent";
import Question from "./Question";
import Result from "./Result";
import IResultData from "../models/Result";

type MainPageProps = { questionNumber: number };

const MainPage = ({ questionNumber }: MainPageProps) => {

  const [showResult, setShowResult] = useState<boolean>(false);
  const initialQuestionState = {
    id: null,
    questionNumber: questionNumber,
    questionText: "",
    answers: []
  };
  const initialResultState = {
    questionNumber: 1,
    firstAnswerRate: 0.0,
    secondAnswerRate: 0.0,
    firstAnswerText: "",
    secondAnswerText: ""
  };
  const [currentResult, setCurrentResult] = useState<IResultData>(initialResultState);
  const [currentQuestion, setCurrentQuestion] = useState<IQuestionData>(initialQuestionState);

  let onQuestionMessageReceived = (msg: IQuestionData) => {
    setCurrentQuestion(msg);
    setShowResult(false);
  }
  let onResultMessageReceived = (msg: IResultData) => {
    setCurrentResult(msg);
    setShowResult(true);
  }

  return (
    <div>
      <WebSocketComponent topics={['/topic/question']} onMessage={(msg: IQuestionData) => onQuestionMessageReceived(msg)} />
      <WebSocketComponent topics={['/topic/result']} onMessage={(msg: IResultData) => onResultMessageReceived(msg)} />
      {showResult ? (<Result questionId={currentQuestion.questionId} />) : (<Question questionNumber={currentQuestion.questionNumber} />)}
    </div>
  );
}

export default MainPage
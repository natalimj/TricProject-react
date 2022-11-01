import React, { useState } from 'react';
import WebSocketComponent from "./WebSocketComponent";
import '../style/MainPage.css';
import Question from "./Question";
import Result from "./Result";
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { RootState } from '../app/store';
import { setQuestionComponent } from '../reducers/componentSlice';
import { setUserVoted } from '../reducers/componentSlice';
import { addAnswer } from '../reducers/answerSlice';
import { setUserResults } from '../reducers/userResultSlice';
import UserApi from '../api/UserApi';
import IResultData from '../models/Result';
import IQuestionData from '../models/Question';

const MainPage = () => {

  const initialResultState = {
    question: {
      questionNumber: 0,
      questionText: '',
      answers: [],
      time: 0,
      theme: ""
    },
    firstAnswerRate: 0.0,
    secondAnswerRate: 0.0,
    firstAnswer: {
      answerText: "",
      category: ""

    },
    secondAnswer: {
      answerText: "",
      category: ""
    }
  };

  const dispatch = useAppDispatch();
  const showQuestion: boolean = useAppSelector((state: RootState) => state.component.questionComponentValue);
  const voted: number = useAppSelector((state: RootState) => state.component.userVotedValue);
  const userId: any = useAppSelector((state: RootState) => state.user.userId);
  const currentQuestion: IQuestionData = {
    questionId: useAppSelector((state: RootState) => state.question.questionId),
    questionNumber: useAppSelector((state: RootState) => state.question.questionNumber),
    questionText: useAppSelector((state: RootState) => state.question.questionText),
    answers: useAppSelector((state: RootState) => [...state.question.answers]),
    time: useAppSelector((state: RootState) => state.question.time),
    theme: useAppSelector((state: RootState) => state.question.theme),
  }
  const answers = useAppSelector((state: RootState) => [...state.question.answers]);
  const [showFinalResult, setShowFinalResult] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<IResultData>(initialResultState);

  const onMessageReceived = (msg: IResultData) => {
    if (voted !== currentQuestion.questionId) {
      console.log('not voted')
      UserApi.saveVote({
        userId: userId,
        questionId: currentQuestion.questionId,
        answerId: answers[0].answerId
      }).then(() => {
        dispatch(addAnswer(answers[0]));
        dispatch(setUserVoted(currentQuestion.questionId));
        dispatch(setUserResults({
          question: currentQuestion,
          answer: answers[0]
        }));
      }).then(() => {
        UserApi.showResult(currentQuestion.questionId).then((newResult: any) => {
          setResultMessage(newResult.data);
          if (newResult.data.question.questionNumber === 1) {
            setShowFinalResult(false);
          }
        });
      }).catch((e: Error) => {
        console.log(e);
      });
    } else {
      setResultMessage(msg);
    }
    if (msg.question.questionNumber === 1) {
      setShowFinalResult(false);
    }
    dispatch(setQuestionComponent(false));
  }

  const onFinalResultMessageReceived = () => {
    dispatch(setQuestionComponent(false));
    setShowFinalResult(true);
  }

  return (
    <div className="main-page">
      <WebSocketComponent topics={['/topic/result']} onMessage={(msg: IResultData) => onMessageReceived(msg)} />
      <WebSocketComponent topics={['/topic/finalResult']} onMessage={() => onFinalResultMessageReceived()} />
      {showQuestion ? (
        <div className="main-page-question"><Question /></div>
      ) : (
        <div className="main-page-result">
          <Result finalResult={showFinalResult} result={resultMessage} />
        </div>
      )}
    </div>
  );
}

export default MainPage
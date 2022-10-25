import React, { useState } from 'react';
import WebSocketComponent from "./WebSocketComponent";
import '../style/MainPage.css';
import Question from "./Question";
import Result from "./Result";
import FinalResult from './FinalResult';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { RootState } from '../app/store';
import { setQuestionComponent } from '../reducers/componentSlice';
import { setUserVoted } from '../reducers/componentSlice';
import { addAnswer } from '../reducers/answerSlice';
import UserApi from '../api/UserApi';

const MainPage = () => {

  const dispatch = useAppDispatch();
  const showQuestion: boolean = useAppSelector((state: RootState) => state.component.questionComponentValue);
  const voted: number = useAppSelector((state: RootState) => state.component.userVotedValue);
  const userId: any = useAppSelector((state: RootState) => state.user.userId);
  const currentQuestionId = useAppSelector((state: RootState) => state.question.questionId);
  const answers = useAppSelector((state: RootState) => [...state.question.answers]);
  const [showFinalResult, setshowFinalResult] = useState<boolean>(false);

  const onMessageReceived = () => {
    if (voted !== currentQuestionId) {
      console.log('voting from here')
      UserApi.saveVote({
        userId: userId,
        questionId: currentQuestionId,
        answerId: answers[0].answerId
      }).then(() => {
        dispatch(addAnswer(answers[0]));
        dispatch(setUserVoted(currentQuestionId));
      }).catch((e: Error) => {
        console.log(e);
      });
    }
    dispatch(setQuestionComponent(false));
  }

  const onFinalResultMessageReceived = () => {
    dispatch(setQuestionComponent(false));
    setshowFinalResult(true);
  }

  return (
    <div className="main-page">
      <WebSocketComponent topics={['/topic/result']} onMessage={() => onMessageReceived()} />
      <WebSocketComponent topics={['/topic/finalResult']} onMessage={() => onFinalResultMessageReceived()} />
      {showQuestion ? (
        <div className="main-page-question"><Question /></div>
      ) : (
        <div className="main-page-result">
          {showFinalResult ? <FinalResult /> : <Result />}
        </div>
      )}
    </div>
  );
}

export default MainPage
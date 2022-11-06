import React, { useState } from 'react';
import WebSocketComponent from "../WebSocketComponent";
import '../../style/MainPage.css';
import Question from "./Question";
import Result from "./Result";
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { RootState } from '../../app/store';
import { ComponentState, setQuestionComponent, setUserVoted, setFinalResultShowed } from '../../reducers/componentSlice';
import { addAnswer } from '../../reducers/answerSlice';
import UserApi from '../../api/UserApi';
import IResultData from '../../models/Result';
import Constants from '../../util/Constants';

const MainPage = () => {
  const dispatch = useAppDispatch();
  const componentData: ComponentState = useAppSelector((state: RootState) => state.component);
  const userId: any = useAppSelector((state: RootState) => state.user.userId);
  const currentQuestionId: number = useAppSelector((state: RootState) => state.question.questionId);
  const answers = useAppSelector((state: RootState) => [...state.question.answers]);

  const [showFinalResult, setShowFinalResult] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<IResultData>(Constants.initialResultState);

  const onMessageReceived = (msg: IResultData) => {
    if (componentData.userVotedValue !== currentQuestionId) {
      UserApi.saveVote({
        userId: userId,
        questionId: currentQuestionId,
        answerId: answers[0].answerId
      }).then(() => {
        dispatch(addAnswer(answers[0]));
        dispatch(setUserVoted(currentQuestionId));
      }).then(() => {
        UserApi.showResult(currentQuestionId).then((newResult: any) => {
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
    dispatch(setFinalResultShowed(true));
    setShowFinalResult(true);
  }

  return (
    <div className="main-page">
      <WebSocketComponent topics={['/topic/result']} onMessage={(msg: IResultData) => onMessageReceived(msg)} />
      <WebSocketComponent topics={['/topic/finalResult']} onMessage={() => onFinalResultMessageReceived()} />
      {componentData.questionComponentValue ? (
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
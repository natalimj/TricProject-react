import React, { useState } from 'react';
import WebSocketComponent from "./WebSocketComponent";
import '../style/MainPage.css';
import Question from "./Question";
import Result from "./Result";
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { RootState } from '../app/store';
import { setQuestionComponent } from '../reducers/componentSlice';
import FinalResult from './FinalResult';

const MainPage = () => {

  const dispatch = useAppDispatch();
  const showQuestion: boolean = useAppSelector((state: RootState) => state.component.questionComponentValue);
  const [showFinalResult, setshowFinalResult] = useState<boolean>(false);

  const onMessageReceived = () => {
    dispatch(setQuestionComponent(false))
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
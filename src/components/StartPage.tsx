import React, { useState, ChangeEvent } from "react";
import './StartPage.css';
import IQuestionData from '../models/Question';
import Constants from "../util/Constants";
import WaitingPage from "./WaitingPage";
import WebSocketComponent from "./WebSocketComponent";
import MainPage from "./MainPage";
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  addQuestion
} from '../reducers/questionSlice';
import {
  setQuestionComponent
} from '../reducers/componentSlice';
import UserLoginPage from "./UserLoginPage";
import { RootState } from "../app/store";

const StartPage = () => {
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);
  const userSubmitted = useAppSelector((state: RootState)=> state.component.userSubmittedValue);
  const [playStarted, setPlayStarted] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const onQuestionMessageReceived = (msg: IQuestionData) => {
    dispatch(addQuestion(msg));
    dispatch(setQuestionComponent(true));
    setPlayStarted(true);
  }

  return (
    <div className="start-page">
      <WebSocketComponent topics={['/topic/question']} onMessage={(msg: IQuestionData) => onQuestionMessageReceived(msg)} />

      {sessionStarted ? (
        <div className="start-page-user">
          {userSubmitted ? (
            <div className="start-page-question"> {playStarted ? (<MainPage />) : (<WaitingPage />)}</div>
          ) : (
            <UserLoginPage />
          )}
        </div>
      ) : (
        <div className="start-page-landing">
          <div className="start-page-landing__title">
            {Constants.APP_TITLE}
          </div>
          <button onClick={() => setSessionStarted(true)} className="submit-button">
            {Constants.JOIN_BUTTON}
          </button>
        </div>
      )}
    </div>
  );
}
export default StartPage
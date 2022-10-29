import React, { useState, useEffect } from "react";
import '../style/StartPage.css';
import UserApi from "../api/UserApi";
import IQuestionData from '../models/Question';
import Constants from "../util/Constants";
import WaitingPage from "./WaitingPage";
import InactiveHomepage from "./InactiveHomepage";
import WebSocketComponent from "./WebSocketComponent";
import MainPage from "./MainPage";
import UserLoginPage from "./UserLogin";
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { RootState } from "../app/store";
import { addQuestion } from '../reducers/questionSlice';
import { setQuestionComponent } from '../reducers/componentSlice';
import { setStatus } from "../reducers/statusSlice";
import TricLogo from '../util/icons/TRIC.svg';

const StartPage = () => {
  const isActive = useAppSelector((state: RootState) => state.status.isActive);
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);
  const userSubmitted = useAppSelector((state: RootState) => state.component.userJoinedValue);
  const [playStarted, setPlayStarted] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const onQuestionMessageReceived = (msg: IQuestionData) => {
    dispatch(addQuestion(msg));
    dispatch(setQuestionComponent(true));
    setPlayStarted(true);
  }

  const onStatusMessageReceived = (msg: boolean) => {
    dispatch(setStatus({ isActive: msg }))
  }

  useEffect(() => {
    UserApi.getAppStatus()
      .then((response: any) => {
        dispatch(setStatus({ isActive: response.data }))
        if (!isActive) {
          setPlayStarted(false);
        }
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }, [dispatch, isActive])

  return (
    <>
      {!isActive ? (
        <>
          <InactiveHomepage />
          <WebSocketComponent topics={['/topic/status']} onMessage={(msg: boolean) => onStatusMessageReceived(msg)} />
        </>) : (
        <div className="start-page">
          <WebSocketComponent topics={['/topic/status']} onMessage={(msg: boolean) => onStatusMessageReceived(msg)} />
          <WebSocketComponent topics={['/topic/question']} onMessage={(msg: IQuestionData) => onQuestionMessageReceived(msg)} />
          {sessionStarted ? (
            <div className="start-page-user">
              {userSubmitted ? (
                <div className="start-page-question"> {playStarted ? (<MainPage />) : (<WaitingPage startScreen={true} />)}</div>
              ) : (
                <UserLoginPage />
              )}
            </div>
          ) : (
            <div className="start-page-landing">
              <div className="start-page-landing__title">
                <img src={TricLogo} alt="TRIC icon" />
              </div>
              <div className="start-page-landing-icon">
                <img src={require('../util/icons/imageMale1.png')} alt="Landing page icon" />
              </div>
              <button onClick={() => setSessionStarted(true)} className="start-page-landing-submit submit-button" e2e-id="join">
                {Constants.JOIN_BUTTON}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
export default StartPage
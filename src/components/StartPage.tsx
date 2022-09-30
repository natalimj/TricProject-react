import React, { useState, ChangeEvent } from "react";
import './StartPage.css';
import UserApi from "../api/UserApi";
import IUserData from '../models/User';
import IQuestionData from '../models/Question';
import Constants from "../util/Constants";
import WaitingPage from "./WaitingPage";
import WebSocketComponent from "./WebSocketComponent";
import MainPage from "./MainPage";
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { RootState } from '../app/store';
import {
  addUser
} from '../reducers/userSlice';
import {
  addQuestion
} from '../reducers/questionSlice';
import {
  setComponent
} from '../reducers/componentSlice';



const StartPage = () => {
  const currentUser: IUserData = {
    userId: useAppSelector((state: RootState) => state.user.userId),
    username: useAppSelector((state: RootState) => state.user.username),
    imagePath: useAppSelector((state: RootState) => state.user.imagePath)
  }
  const [user, setUser] = useState<IUserData>(currentUser);
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);
  const [userSubmitted, setUserSubmitted] = useState<boolean>(false);
  const [playStarted, setPlayStarted] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };
  const saveUser = () => {
    if (user.username !== '') {
      UserApi.createUser(user)
        .then((response: any) => {
          setUserSubmitted(true);  // hide input field and button - show spinner
          dispatch(addUser(response.data));
        })
        .catch((e: Error) => {
          console.log(e);
        });
    }
  };
  const onQuestionMessageReceived = (msg: IQuestionData) => {
    dispatch(addQuestion(msg));
    dispatch(setComponent(true));
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
            <div className="start-page-user__user-form">
              <div className="start-page-user__header">
                {currentUser.username === '' ? Constants.CREATE_USER_FIELD : Constants.LOGIN_USER_FIELD}
              </div>
              <div className="start-page-user__form-group">
                <div className="start-page-user__header start-page-user--username">
                  {Constants.USERNAME_FIELD}
                  <input
                    type="text"
                    className="start-page-user__form-control"
                    id="username"
                    data-cy="username"
                    required
                    value={user.username}
                    onChange={handleInputChange}
                    name="username"
                  />
                </div>
              </div>
              <div className="start-page-user__avatar-container">
                <div>
                  {Constants.AVATAR_FIELD}
                </div>
              </div>
              <button onClick={saveUser} className="submit-button" data-cy="create">
                {Constants.SUBMIT_BUTTON}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="start-page-landing">
          <div className="start-page-landing__title">
            {Constants.APP_TITLE}
          </div>
          <button onClick={() => setSessionStarted(true)} className="submit-button" data-cy="join">
            {Constants.JOIN_BUTTON}
          </button>
        </div>
      )}
    </div>
  );
}
export default StartPage
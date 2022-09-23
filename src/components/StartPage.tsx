import React, { useState, ChangeEvent } from "react";
import UserApi from "../api/UserApi";
import IUserData from '../models/User';
import IQuestionData from '../models/Question';
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


const StartPage = () => {
  const currentUser: IUserData = {
    userId: useAppSelector((state: RootState) => state.user.userId),
    username: useAppSelector((state: RootState) => state.user.username),
    imagePath: useAppSelector((state: RootState) => state.user.imagePath)
  }
  const [user, setUser] = useState<IUserData>(currentUser);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };
  const saveUser = () => {
    if (user.username !== '') {
      UserApi.createUser(user)
        .then((response: any) => {
          setSubmitted(true);  // hide input field and button - show spinner
          dispatch(addUser(response.data));
        })
        .catch((e: Error) => {
          console.log(e);
        });
    }
  };

  let onQuestionMessageReceived = (msg: IQuestionData) => {
    console.log("Not waiting")
    dispatch(addQuestion(msg))
    setSessionStarted(true);
  }

  return (
    <div>
      <WebSocketComponent topics={['/topic/question']} onMessage={(msg: IQuestionData) => onQuestionMessageReceived(msg)} />
      <div className="submit-form">
        {submitted ? (
          <div> {sessionStarted ? (<MainPage />) : (<WaitingPage />)}</div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                required
                value={user.username}
                onChange={handleInputChange}
                name="username"
              />
            </div>
            <button onClick={saveUser} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
export default StartPage
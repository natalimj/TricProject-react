import React from 'react';
import { useState } from 'react'
import AdminApi from '../api/AdminApi';
import IQuestionData from '../models/Question';
import WebSocketComponent from './WebSocketComponent';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setStatus } from '../reducers/statusSlice';
import { RootState } from '../app/store';
import Constants from '../util/Constants';

const Admin = () => {

  const initialQuestionState = {
    id: null,
    questionNumber: 0,
    questionText: "",
    answers: []
  };

  const [showQuestionNo, setShowQuestionNo] = useState<boolean>(false);
  const [showResultNo, setShowResultNo] = useState<boolean>(false);
  const [questionNo, setQuestionNo] = useState<number>(0);
  const [numberOfUsers, setNumberOfUsers] = useState<number>(0);
  const [question, setQuestion] = useState<IQuestionData>(initialQuestionState);
  const isActive = useAppSelector((state: RootState) => state.status.isActive);

  const dispatch = useAppDispatch();

  const startSession = () => {
    AdminApi.getQuestionByNumber(1).then((response: any) => {
      console.log(response.data);
    })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const showNextQuestion = (questionNumber: number) => {
    setQuestionNo(questionNumber + 1);
    AdminApi.getQuestionByNumber(questionNo + 1)
      .then((response: any) => {
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
    setShowResultNo(false);
  };

  const showResult = (questionId: any) => {
    AdminApi.showResult(questionId)
      .then((response: any) => {
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });

    setShowQuestionNo(false);
    setShowResultNo(true);
  };


  const endSession = () => {
    //delete all users and user answers + deactivate the app status

    AdminApi.endSession()
      .then((response: any) => {
        console.log(response.data);
        dispatch(setStatus({ isActive: false }))
      })
      .catch((e: Error) => {
        console.log(e);
      });

    setShowResultNo(false);
  };


  const showFinalResult = () => {
    AdminApi.showFinalResult()
      .then((response: any) => {
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  let onQuestionReceived = (msg: IQuestionData) => {
    setQuestionNo(msg.questionId);
    setShowQuestionNo(true);
    setQuestion(msg);
  }

  let onMessageReceived = (msg: number) => {
    setNumberOfUsers(msg);
  }

  const activateApp = () => {
    AdminApi.activateApp()
      .then((response: any) => {
        console.log(response.data);
        dispatch(setStatus({ isActive: true }))
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  return (
    <div>Admin
      <br />
      <button onClick={activateApp} className="btn btn-success">
        {Constants.ACTIVATE_BUTTON}
      </button>
      <br />
      {isActive &&
        <div>
          <button onClick={startSession} className="btn btn-success">
            {Constants.START_BUTTON}
          </button>

          <div>
            <WebSocketComponent topics={['/topic/question']} onMessage={(msg: IQuestionData) => onQuestionReceived(msg)} />
            <WebSocketComponent topics={['/topic/message']} onMessage={(msg2: number) => onMessageReceived(msg2)} />
            <p>online users: {numberOfUsers}</p>

            {showQuestionNo && <div><p>Question {questionNo} is on screen....</p><button onClick={() => showResult(question.questionId)} className="btn btn-success">
              {Constants.RESULT_BUTTON}
            </button>
          </div>}

            {showResultNo && <div>
            <p>Result {questionNo} is on screen....</p>
            <button onClick={() => showNextQuestion(questionNo)} className="btn btn-success">
            {Constants.NEXT_BUTTON}
            </button> </div>}

            <button onClick={showFinalResult} className="btn btn-success">
              {Constants.FINAL_RESULT_BUTTON}
            </button>

            <button onClick={endSession} className="btn btn-success">
              {Constants.END_BUTTON}
            </button>

          </div>
        </div>}
    </div>
  )
}

export default Admin
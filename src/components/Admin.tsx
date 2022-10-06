import React, { useEffect } from 'react';
import { useState } from 'react'
import WebSocketComponent from './WebSocketComponent';
import AdminApi from '../api/AdminApi';
import IQuestionData from '../models/Question';
import Constants from '../util/Constants';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setStatus } from '../reducers/statusSlice';
import { RootState } from '../app/store';
import { setUserSubmitted, setQuestionComponent } from '../reducers/componentSlice';
import { removeUser } from '../reducers/userSlice';

const Admin = () => {
  const initialQuestionState = {
    id: null,
    questionNumber: 0,
    questionText: "",
    answers: [],
    time: 30
  };

  const isActive = useAppSelector((state: RootState) => state.status.isActive);
  const [numberOfUsers, setNumberOfUsers] = useState<number>(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(0);
  const [question, setQuestion] = useState<IQuestionData>(initialQuestionState);
  const [showQuestionButton, setShowQuestionButton] = useState<boolean>(false);
  const [showFinalButtons, setShowFinalButtons] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);

  const dispatch = useAppDispatch();

  const showResult = (questionId: any) => {
    AdminApi.showResult(questionId)
      .then((response: any) => {
        getQuestion(response.data.question.questionNumber + 1)
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const getQuestion = (questionNo: number) => {
    AdminApi.getQuestionByNumber(questionNo)
      .then((response: any) => {
        setQuestion(response.data)
        setShowQuestionButton(true)
      })
      .catch((e: Error) => {
        console.log(e);
      });

  };
  const endSession = () => {
    dispatch(setStatus({ isActive: false }));
    dispatch(setUserSubmitted(false));
    dispatch(setQuestionComponent(false));
    dispatch(removeUser());
    AdminApi.endSession()
      .then((response: any) => {
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
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


  let onMessageReceived = (msg: number) => {
    setNumberOfUsers(msg);
  }

  const activateApp = () => {
    AdminApi.activateApp()
      .then((response: any) => {
        console.log(response.data);
        dispatch(setStatus({ isActive: true }))
        getQuestion(1)
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const showQuestion = () => {
    AdminApi.showQuestion(question.questionNumber)
      .then((response: any) => {
        setTimer(question.time)
        setShowQuestionButton(false)
        if (numberOfQuestions === question.questionNumber) {
          setShowFinalButtons(true)
        }

      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  function handleTimeChange(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault()
    let time :number ;
    if(e.currentTarget.value !== ""){
      time = parseInt(e.currentTarget.value)

      AdminApi.addQuestionTime(question.questionId, time)
      .then((response: any) => {
        setQuestion(response.data)
      })
      .catch((e: Error) => {
        console.log(e);
      });
    }   else {
      setQuestion({...question,time : NaN})
    }
  }

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer(timer => timer - 1)
      }, 1000);
    } else if (timer === 0) {
      if (question.questionNumber !== numberOfQuestions) {
        showResult(question.questionId)
      } else {
        showFinalResult()
      }
    }
  }, [numberOfQuestions, question.questionId, question.questionNumber, showResult, timer]);


  useEffect(() => {
    AdminApi.getNumberOfQuestions()
      .then((response: any) => {
        setNumberOfQuestions(response.data)
      })
      .catch((e: Error) => {
        console.log(e);
      });

    getQuestion(1)
  }, [numberOfQuestions])


  return (
    <div>Admin
      <br />
      {!isActive && <button onClick={activateApp} className="btn btn-success">
        {Constants.ACTIVATE_BUTTON}
      </button>}
      <br />
      {isActive &&
        <div>
          <div>
            <WebSocketComponent topics={['/topic/message']} onMessage={(msg: number) => onMessageReceived(msg)} />
            <p>online users: {numberOfUsers}</p>
            {!showQuestionButton && <div><p>Question {question.questionNumber} is on screen....</p> <p> {timer} seconds remaining</p>
              {!showFinalButtons && <button onClick={() => showResult(question.questionId)} className="btn btn-success">
                Show Result {question.questionNumber}
              </button>}
            </div>}
            {showQuestionButton && question.questionNumber !== 1 && <p>Result {question.questionNumber - 1} is on screen....</p>}
            {showQuestionButton && <div>
              <label>Time for {question.questionNumber}: </label><input type="text"
                name="time"
                value={question.time || ''}
                onChange={(e)=>handleTimeChange(e)} />
              <button onClick={() => showQuestion()} className="btn btn-success">
                Show Question {question.questionNumber}
              </button> </div>}
            {showFinalButtons &&
              <div> 
              <button onClick={showFinalResult} className="btn btn-success">
                {Constants.FINAL_RESULT_BUTTON}
              </button>
              <button onClick={endSession} className="btn btn-success">
                {Constants.END_BUTTON}
              </button> </div>}
          </div>
        </div>}
    </div>
  )
}

export default Admin
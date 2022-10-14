import React, { useEffect } from 'react';
import { useState } from 'react'
import WebSocketComponent from './WebSocketComponent';
import AdminApi from '../api/AdminApi';
import IQuestionData from '../models/Question';
import Constants from '../util/Constants';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setStatus } from '../reducers/statusSlice';
import { RootState } from '../app/store';
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';

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
  const [timer, setTimer] = useState<number>(0);
  const dispatch = useAppDispatch();

  const getQuestion = (questionNo: number) => {
    AdminApi.getQuestionByNumber(questionNo)
      .then((response: any) => {
        setQuestion(response.data)
        setShowQuestionButton(true)
      })
      .catch((e: Error) => {
        NotificationManager.error(e.message,'Error!', 5000);
      });
  };

  let onMessageReceived = (msg: number) => {
    setNumberOfUsers(msg);
  }

  const activateApp = () => {
    AdminApi.activateApp()
      .then((response: any) => {
        dispatch(setStatus({ isActive: true }))
        getQuestion(1)
      })
      .catch((e: Error) => {
        NotificationManager.error(e.message,'Error!', 5000);
      });
  };

  const showQuestion = () => {
    AdminApi.showQuestion(question.questionNumber)
      .then((response: any) => {
        setTimer(question.time)
        setShowQuestionButton(false)
        NotificationManager.info('Question '+question.questionNumber+' on screen', 'Info!', 2000);
      })
      .catch((e: Error) => {
        NotificationManager.error(e.message,'Error!', 5000);
      });
  }

  const handleTimeChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    let time: number;
    if (e.currentTarget.value !== "") {
      time = parseInt(e.currentTarget.value)

      AdminApi.addQuestionTime(question.questionId, time)
        .then((response: any) => {
          setQuestion(response.data)
        })
        .catch((e: Error) => {
          NotificationManager.error(e.message,'Error!', 5000);
        });
    } else {
      setQuestion({ ...question, time: NaN })
    }
  }

  const showResult = () => {
    AdminApi.showResult(question.questionId)
      .then((response: any) => {
        setTimer(-1);
        getQuestion(response.data.question.questionNumber + 1);
        NotificationManager.info('Result '+response.data.question.questionNumber+' on screen', 'Info!', 2000);
      })
      .catch((e: Error) => {
        NotificationManager.error(e.message,'Error!', 5000);
      });
  };

  const endSession = () => {
    dispatch(setStatus({ isActive: false }));
    AdminApi.endSession()
      .then((response: any) => {
         const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(response.data)
          )}`;
         const link = document.createElement("a");
          link.href = jsonString;
          link.download = "ResultData.json";
          link.click(); 
        NotificationManager.info('User data has been deleted', 'Info!', 2000);
      })
      .catch((e: Error) => {
        NotificationManager.error(e.message,'Error!', 5000);
      });
  };

  const showFinalResult = () => {
    AdminApi.showFinalResult()
      .then((response: any) => {
        if(question.questionNumber !== 0){
          NotificationManager.info('Final Result on screen', 'Info!', 2000);
        setTimer(0);
        }     
      })
      .catch((e: Error) => {
        NotificationManager.error(e.message,'Error!', 5000);
      });
  };

  useEffect(() => {

    if (timer > 0) {
      setTimeout(() => {
        setTimer(timer => timer - 1)
      }, 1000);
    } else if (timer === 0) {
      if (question.questionNumber !== numberOfQuestions) {
        showResult();
      } else {
        showFinalResult()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  useEffect(() => {
    
    AdminApi.getNumberOfQuestions()
      .then((response: any) => {
        setNumberOfQuestions(response.data)
        getQuestion(1)
      })
      .catch((e: Error) => {
        NotificationManager.error(e.message,'Error!', 5000);
      });
    
  }, [numberOfQuestions])

  return (
    <div> {Constants.ADMIN_TITLE}
      <br />
      {!isActive && <button onClick={activateApp} className="btn btn-success">
        {Constants.ACTIVATE_BUTTON}
      </button>}
      <br />
      {isActive &&
        <div>
          <div>
            <WebSocketComponent topics={['/topic/message']} onMessage={(msg: number) => onMessageReceived(msg)} />
            <p>{Constants.ONLINE_USERS} {numberOfUsers}</p>
            {!showQuestionButton ?
              (<div>
                {timer > 0 ? (
                  <>
                    <p>{Constants.QUESTION_FIELD} {question.questionNumber} {Constants.ON_SCREEN_FIELD}</p>
                    <p> {timer} {Constants.TIME_REMANING}</p>
                  </>
                ) : null}
                {question.questionNumber < numberOfQuestions ? (
                  <button onClick={() => showResult()} className="btn btn-success">
                    {Constants.RESULT_BUTTON} {question.questionNumber}
                  </button>
                ) : (
                  <>
                    {timer <= 0 ? (
                      <p>{Constants.RESULT_FIELD} {question.questionNumber} {Constants.ON_SCREEN_FIELD}</p>
                    ) : (
                      <div>
                        <button onClick={showFinalResult} className="btn btn-success">
                          {Constants.FINAL_RESULT_BUTTON}
                        </button>
                      </div>
                    )}
                    <div>
                      <button onClick={endSession} className="btn btn-success">
                        {Constants.END_BUTTON}
                      </button>
                    </div>
                  </>
                )}
              </div>) :
              (<>
                {question.questionNumber !== 1 ?
                  (<p>{Constants.RESULT_FIELD} {question.questionNumber - 1} {Constants.ON_SCREEN_FIELD}</p>) : null}
                <div>
                  <label>{Constants.TIME_FOR} {question.questionNumber}: </label>
                  <input type="text"
                    name="time"
                    value={question.time || ''}
                    onChange={(e) => handleTimeChange(e)} />
                  <button onClick={() => showQuestion()} className="btn btn-success">
                    {Constants.QUESTION_BUTTON} {question.questionNumber}
                  </button>
                </div>
              </>
              )
            }
          </div>
        </div>}
    </div>
  )
}

export default Admin
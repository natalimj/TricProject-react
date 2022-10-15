import React, { useEffect } from 'react';
import { useState } from 'react'
import '../style/Admin.css';
import WebSocketComponent from './WebSocketComponent';
import AdminApi from '../api/AdminApi';
import IQuestionData from '../models/Question';
import Constants from '../util/Constants';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setStatus } from '../reducers/statusSlice';
import { RootState } from '../app/store';
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';
import UserApi from '../api/UserApi';

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
        NotificationManager.error(e.message, 'Error!', 5000);
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
        NotificationManager.error(e.message, 'Error!', 5000);
      });
  };

  const editQuestions = () => {
    window.location.href = "/admin/questions";
  };

  const editContributors = () => {
    window.location.href = "/admin/playInfo";
  };

  const showQuestion = () => {
    AdminApi.showQuestion(question.questionNumber)
      .then((response: any) => {
        setTimer(question.time)
        setShowQuestionButton(false)
        NotificationManager.info('Question ' + question.questionNumber + ' on screen', 'Info!', 2000);
      })
      .catch((e: Error) => {
        NotificationManager.error(e.message, 'Error!', 5000);
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
          NotificationManager.error(e.message, 'Error!', 5000);
        });
    } else {
      setQuestion({ ...question, time: NaN })
    }
  }

  const showResult = () => {
    UserApi.showResult(question.questionId)
      .then((response: any) => {
        setTimer(-1);
        getQuestion(response.data.question.questionNumber + 1);
        NotificationManager.info('Result ' + response.data.question.questionNumber + ' on screen', 'Info!', 2000);
      })
      .catch((e: Error) => {
        NotificationManager.error(e.message, 'Error!', 5000);
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
        NotificationManager.error(e.message, 'Error!', 5000);
      });
  };

  const showFinalResult = () => {
    AdminApi.showFinalResult()
      .then((response: any) => {
        if (question.questionNumber !== 0) {
          NotificationManager.info('Final Result on screen', 'Info!', 2000);
          setTimer(0);
        }
      })
      .catch((e: Error) => {
        NotificationManager.error(e.message, 'Error!', 5000);
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
        NotificationManager.error(e.message, 'Error!', 5000);
      });

  }, [numberOfQuestions])

  return (
    <div className='admin-console'>
      <div className='admin-console__header'>
        {Constants.ADMIN_TITLE}
      </div>
      {!isActive &&
        <div className='admin-console__body'>
          <div className='admin-console__logo'></div>
          <div className='admin-console__buttons'>
            <button onClick={editContributors} className="admin-console__submit-button--secondary">
              {Constants.EDIT_CONTRIBUTORS}
            </button>
            <button onClick={editQuestions} className="admin-console__submit-button--secondary">
              {Constants.EDIT_QUESTIONS}
            </button>
            <button onClick={activateApp} className="admin-console__submit-button">
              {Constants.START_BUTTON}
            </button>
          </div>
        </div>
      }
      {isActive &&
        <div className='admin-console__body admin-console__body--active'>
          <WebSocketComponent topics={['/topic/message']} onMessage={(msg: number) => onMessageReceived(msg)} />
          <div className='admin-console__text'>
            {Constants.ONLINE_USERS} {numberOfUsers}
          </div>
          {!showQuestionButton ?
            (<div className='admin-console__buttons'>
              {timer > 0 ? (
                <>
                  <div className='admin-console__text'>{Constants.QUESTION_FIELD} {question.questionNumber} {Constants.ON_SCREEN_FIELD}</div>
                  <div className='admin-console__text'> {timer} {Constants.TIME_REMANING}</div>
                </>
              ) : null}
              {question.questionNumber < numberOfQuestions ? (
                <button onClick={() => showResult()} className="admin-console__submit-button--secondary">
                  {Constants.RESULT_BUTTON} {question.questionNumber}
                </button>
              ) : (
                <>
                  {timer <= 0 ? (
                    <div className='admin-console__text'>{Constants.RESULT_FIELD} {question.questionNumber} {Constants.ON_SCREEN_FIELD}</div>
                  ) : (
                    <>
                      <button onClick={showFinalResult} className="admin-console__submit-button--secondary">
                        {Constants.FINAL_RESULT_BUTTON}
                      </button>
                    </>
                  )}
                  <button onClick={endSession} className="admin-console__submit-button">
                    {Constants.END_BUTTON}
                  </button>
                </>
              )}
            </div>) :
            (<div className='admin-console__buttons'>
              {question.questionNumber !== 1 ?
                (<div className='admin-console__text'>{Constants.RESULT_FIELD} {question.questionNumber - 1} {Constants.ON_SCREEN_FIELD}</div>) : null}
              <div className='admin-console__edit-time'>
                <div className='admin-console__text admin-console__text--medium'>
                  {Constants.TIME_FOR} {question.questionNumber}:
                </div>
                <input type="text"
                  name="time"
                  value={question.time || ''}
                  onChange={(e) => handleTimeChange(e)}
                  className="admin-console__input" />
              </div>
              <button onClick={() => showQuestion()} className="admin-console__submit-button--secondary">
                {Constants.QUESTION_BUTTON} {question.questionNumber}
              </button>
            </div>
            )
          }
        </div>
      }
    </div>
  )
}

export default Admin
import React, { useEffect } from 'react';
import { useState } from 'react'
import WebSocketComponent from './WebSocketComponent';
import AdminApi from '../api/AdminApi';
import IQuestionData from '../models/Question';
import Constants from '../util/Constants';
import { useAppDispatch } from '../app/hooks';
import { setStatus } from '../reducers/statusSlice';
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';
import UserApi from '../api/UserApi';

const AdminConsole = () => {
    const initialQuestionState = {
        id: null,
        questionNumber: 0,
        questionText: "",
        answers: [],
        time: 30
    };

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

    const showQuestion = () => {
        AdminApi.showQuestion(question.questionNumber)
            .then(() => {
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
            .then(() => {
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
        <>
            <WebSocketComponent topics={['/topic/message']} onMessage={(msg: number) => onMessageReceived(msg)} />
            <div className='admin-console__body admin-console__body--active'>
                <div className='admin-console__text'>
                    {Constants.ONLINE_USERS} {numberOfUsers}
                    {question.questionNumber !== 1 && showQuestionButton ? (
                        <div className='admin-console__text'>{Constants.RESULT_FIELD} {question.questionNumber - 1} {Constants.ON_SCREEN_FIELD}</div>
                    ) : null}
                </div>
                {showQuestionButton ?
                    (
                        <>
                            <div className='admin-console__buttons'>
                                <div className='admin-console__next-question-text'>
                                    <div className='admin-console__text admin-console__text--medium'>
                                        {Constants.NEXT_QUESTION_TEXT}
                                    </div>
                                    {question.questionNumber}. {question.questionText}
                                </div>
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
                            <div className='admin-console__text admin-console__text--helper'>
                                {Constants.SET_TIME_INFO}
                            </div>
                        </>
                    ) : (
                        <div className='admin-console__buttons admin-console__buttons--result'>
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
                                    {timer > 0 ? (
                                        <button onClick={showFinalResult} className="admin-console__submit-button--secondary">
                                            {Constants.FINAL_RESULT_BUTTON}
                                        </button>
                                    ) : (
                                        <>
                                            <div className='admin-console__text'>{Constants.FINAL_RESULT_FIELD} {Constants.ON_SCREEN_FIELD}</div>
                                            <button onClick={endSession} className="admin-console__submit-button">
                                                {Constants.END_BUTTON}
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    )
                }
            </div>
        </>
    )
}
export default AdminConsole;